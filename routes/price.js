const router = require('express').Router()
const Price = require('../models/price.model')
const jwt = require('jsonwebtoken')

router.route('/').get((req, res) => {
    Price.find({})
    .then(price => {
        res.json(price)
    })
    .catch(err => res.status(400).json('Error: ' + err))
})

router.route('/add').post(authToken, (req, res) => {
    if(req.payload.role[0] === 'ผู้ดูแลระบบ') {        
        const price = new Price({name: req.body.name, price: req.body.price})
        price.save()
        .then(() => {
            res.json({message: "Price added", price: price})
        })
        .catch(err => res.status(400).json('Error: ' + err))
    } else {
         res.sendStatus(401)
    }
})

router.route('/update/:id').post(authToken, (req, res) => {
    if(req.payload.role[0] === 'ผู้ดูแลระบบ'){
        Price.findById(req.params.id)
        .then(price => {
            price.price = req.body.price
            price.save()
            .then(() => {
                res.json({message: "๊Price Update", price})
            })
        })
    } else {
        res.sendStatus(401)
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

module.exports = router