const router = require('express').Router();
let User = require('../models/user.model');
let Garden = require('../models/garden.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

require('dotenv').config();

router.route('/').get((req, res) => {
    User.find({},'-password')
        .then(users => {
            users.map(user => {
                for(i = 2; i <= 9; i++) {
                    user.citizen_id =  user.citizen_id.substring(0, i) + "x" + user.citizen_id.substring(i + 1)
                }
            })
            res.json(users)
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post(async (req, res) => {
    user = await User.findOne({username: req.body.user.username})
    if(!user){
        const hashedPassword = await bcrypt.hash(req.body.user.password, 10);
            const data = {
                ...req.body.user,
                password: hashedPassword,
            }
            const newUser = new User(data)
        if(req.body.user.role === 'เกษตรกร'){
            req.body.gardens.map(garden => {
                const newGarden = new Garden(garden)
                newGarden.save()
                newUser.gardens.push(newGarden)
            })
        }
        newUser.save()
        .then(() => {
            res.json('User added!')
        })
        .catch(err => res.status(400).json('Error: ' + err));
    } else {
        res.json('username is invalid')
    }
});

// get user
router.route('/:id').get((req, res) => {
    User.findById(req.params.id, '-password')
        .then(user => res.json(user))
        .catch(err => res.status(400).json('Error: ' + err));
});

// get user and populate garden
router.route('/:id/gardens').get(authToken, (req, res) => { 
    if(req.payload.role[0] === 'ผู้ดูแลระบบ'){
        User.findById(req.params.id)
        .populate('gardens')
        .then(user => res.json(user))
        .catch(err => res.status(400).json('Error: ' + err));
    } else {
        res.sendStatus(401)
    }
});


// login
router.route('/login').post(async (req, res) => {
    User.findOne({username: req.body.username})
        .populate('gardens')
        .then(user => {
            if(bcrypt.compareSync(req.body.password, user.password)){
                const token = jwt.sign({username: user.username, role: user.role}, process.env.ACCESS_TOKEN_PRIVATE)
                let { role, gardens, friendlist, _id, username, firstname, lastname, cert_1, address, district, subdistrict, zipcode, province, citizen_id, email, tel } = user._doc
                for(i = 2; i <= 9; i++) {
                    citizen_id = citizen_id.substring(0, i) + "x" + citizen_id.substring(i + 1)
                }
                const payload = {
                    username, role, _id, email,
                    address, district, subdistrict,
                    zipcode, province,citizen_id,
                    firstname, lastname, friendlist,
                    gardens, cert_1, token, tel
                }
                res.json({message:"Logged In", user: payload})
            } else {
                res.json("Not Allow")
            }
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

// add friend
router.route('/addFriend/:id').post(authToken, async (req, res) => {
    try{
        const friend = await User.findOne({username: req.body.username})
        const user = await User.findById(req.params.id)
        const friendName = friend.firstname + " " + friend.lastname
        if(!user.friendlist.includes(friendName)){
            user.friendlist.push(friendName)
            user.save()
            res.json({message: "Friend Added", friends: user.friendlist, role: friend.role[0]})
        } else {
            res.json('Dupe')
        }
    }
    catch (error) {
        res.status(400).json('Error: ' + error)
    }
    
})

// get friends
router.route('/getFriends/:id').get(authToken, (req, res) => {
    User.findById(req.params.id)
    .then(user => {
        res.json(user.friendlist)
    })
})

// search certification
router.route('/search').post(async (req, res) => {
    const cert = req.body.cert
    try{
        user = await User.find({cert_1: cert})
        if(user.length != 0) {
            res.json('OK')  
        } else {
            res.json('NO')
        }
    } catch(err) {
        res.status(400).json('Error: ' + err)
    }
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
