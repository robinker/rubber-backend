const router = require('express').Router();
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
                            // console.log(transaction)
                            if(transaction != null) {
                                // console.log('Update Block ', rubberType)
                                // console.log(transaction.source, ' -> ', transaction.destination)
                                Block.find({lastState: transaction.destination, rubberType})
                                .then(blocks => {
                                    // console.log(blocks)
                                    blocks.map(obj => {
                                        obj.holders.push(newTransaction.destination)
                                        obj.chain.push(newTransaction)
                                        obj.lastState = newTransaction.destination
                                        obj.save()
                                    })
                                })
                            } else {
                                // console.log('new Block')
                                let chain = []
                                let holders = []
                                chain.push(newTransaction)
                                if(!holders.includes(newTransaction.source)){
                                    holders.push(newTransaction.source)
                                }
                                if(!holders.includes(newTransaction.destination)){
                                    holders.push(newTransaction.destination)
                                }
                                const newBlock = new Block({lastState, rubberType, chain, holders})
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

router.route('/transactions/:firstname/:lastname').get((req, res) => {
    const fullname = req.params.firstname + ' ' + req.params.lastname
    Block.find({holders: fullname})
        .then(blocks => { 
            res.json(blocks) 
        
        })
        .catch(err => res.status(400).json('Error: ' + err))
})

module.exports = router;