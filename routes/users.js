const router = require('express').Router();
let User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

require('dotenv').config();

router.route('/').get((req, res) => {
    User.find({},'username role firstname lastname cert_1 friendlist')
        .then(users => res.json(users))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post(authToken, async (req, res) => {
    if(!User.find({username: req.body.username})){
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = {
            username: req.body.username,
            password: hashedPassword,
            role: req.body.role,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            cert_1: req.body.cert_1,
        };
        const newUser = new User(user);
        newUser.save()
        .then(() => res.json('User added!'))
        .catch(err => res.status(400).json('Error: ' + err));
    } else {
        res.json('username is invalid')
    }
});

// get user
router.route('/:id').get((req, res) => {
    User.findById(req.params.id)
        .then(user => res.json(user))
        .catch(err => res.status(400).json('Error: ' + err));
});

// delete user
router.route('/:id').delete((req, res) => {
    User.findByIdAndDelete(req.params.id)
        .then(() => res.json('User deleted'))
        .catch(err => res.status(400).json('Error: ' + err));
});

// update user
router.route('/update/:id').post((req, res) => {
    User.findById(req.params.id)
        .then(user => {
            user.username = req.body.username;
            if(req.password !== ''){
                user.password = bcrypt.hashSync(req.body.password, 10);
            }
            user.role = req.body.role;

            user.save()
                .then(() => res.json('User updated'))
                .catch(err => res.status(400).json('Error: ' + err))
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

// login
router.route('/login').post(async (req, res) => {
    User.findOne({username: req.body.username})
        .then(user => {
            if(bcrypt.compareSync(req.body.password, user.password)){
                const token = jwt.sign({username: user.username, role: user.role}, process.env.ACCESS_TOKEN_PRIVATE)
                const payload = {
                    ...user._doc,
                    token
                }
                res.json({message:"Logged In", user: payload})
            } else {
                res.json("Not Allow")
            }
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

// add friend
router.route('/addFriend/:id').post(authToken,async (req, res) => {
    try{
        const friend = await User.findOne({username: req.body.username})
        const user = await User.findById(req.params.id)
        const friendName = friend.firstname + " " + friend.lastname
        if(!user.friendlist.includes(friendName)){
            user.friendlist.push(friendName)
            user.save()
            res.json({message: "Friend Added", friends: user.friendlist})
        } else {
            res.json('Dupe')
        }
    }
    catch (error) {
        res.status(400).json('Error: ' + error)
    }
    
})

//get friends
router.route('/getFriends/:id').get(authToken, (req, res) => {
    User.findById(req.params.id)
    .then(user => {
        res.json(user.friendlist)
    })
})

function authToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token === null) return res.sendStatus(401)
    jwt.verify(token, process.env.ACCESS_TOKEN_PRIVATE, (err, payload) => {
        if(err) return res.status(403).json(err)
        req.payload = payload
        next()
    })
}

module.exports = router;