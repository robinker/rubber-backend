const router = require('express').Router();
var mongoose = require('mongoose');
let User = require('../models/user.model');
let Transaction = require('../models/transaction.model');
let Block = require('../models/block.model');


router.route('/add').post((req, res) => {
    const firstname = req.body.destination.split(' ')[0]
    const lastname = req.body.destination.split(' ')[1]

    if (User.findOne({firstname, lastname})) {
            let transaction = {
                source: req.body.source,
                rubberType: req.body.rubberType,
                volume: req.body.volume,
                price: req.body.price,
                destination: req.body.destination,
            } 
            
            const newTransaction = new Transaction(transaction)
            const lastState = newTransaction.destination
            const rubberType = newTransaction.rubberType
            newTransaction.save()
                .then(() => {
                    Transaction.findOne({rubberType, destination: req.body.source})
                        .then(transaction => {
                            console.log(transaction)
                            if(transaction != null) {
                                // console.log('Update Block ', rubberType)
                                // console.log(transaction.source, ' -> ', transaction.destination)
                                Block.find({lastState: transaction.destination, rubberType})
                                .then(blocks => {
                                    console.log(blocks)
                                    blocks.map(obj => {
                                        obj.chain.push(newTransaction)
                                        obj.lastState = newTransaction.destination
                                        obj.save()
                                    })
                                })
                            } else {
                                // console.log('new Block')
                                let chain = []
                                chain.push(newTransaction)
                                const newBlock = new Block({lastState, rubberType, chain})
                                newBlock.save()
                            }
                            res.json('Transaction added!')
                        })
                    })
                .catch(err => res.status(400).json('Error: ' + err))

    } else {
        res.status(400).json('ไม่มีผู้ใช่นี้ในระบบ')
    }
});

router.route('/').get((req, res) => {
    Transaction.find()
                .then(transactions => res.json(transactions))
                .catch(err => res.status(400).json('Error: ' + err))
})

router.route('/source/:firstname/:lastname').get((req, res) => {
    const source = req.params.firstname + ' ' + req.params.lastname
    Block.find({chain: {$elemMatch: {source}}})
        .then(blocks => { res.json(blocks) })
        .catch(err => res.status(400).json('Error: ' + err))
})

router.route('/destination/:firstname/:lastname').get((req, res) => {
    const destination = req.params.firstname + ' ' + req.params.lastname
    Transaction.find({destination})
                .then(transactions => res.json(transactions))
                .catch(err => res.status(400).json('Error: ' + err))
})

module.exports = router;