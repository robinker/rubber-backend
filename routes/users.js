const router = require('express').Router();
let User = require('../models/user.model');
const bcrypt = require('bcrypt');

router.route('/').get((req, res) => {
    User.find({},'username role firstname lastname')
        .then(users => res.json(users))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post(async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = {
        username: req.body.username,
        password: hashedPassword,
        role: req.body.role,
        firstname: req.body.firstname,
        lastname: req.body.lastname
    };
    const newUser = new User(user);

    newUser.save()
        .then(() => res.json('User added!'))
        .catch(err => res.status(400).json('Error: ' + err));
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
router.route('/login').post((req, res) => {
    User.findOne({username: req.body.username})
        .then(user => {
            if(bcrypt.compareSync(req.body.password, user.password)){
                res.json({message:"Logged In", user: user})
            } else {
                res.json("Not Allow")
            }
        })
        .catch(err => res.status(400).json('Error: ' + err));
});


module.exports = router;