const router = require('express').Router();
let User = require('../models/user.model');
let Transaction = require('../models/transaction.model');
let Block = require('../models/block.model');

router.route('/add').post( async(req, res) => {
    const firstname = req.body.destination.split(' ')[0]
    const lastname = req.body.destination.split(' ')[1]
    const firstname2 = req.body.source.name.split(' ')[0]
    const lastname2 = req.body.source.name.split(' ')[1]
    try {
        let user1 = await User.findOne({firstname: firstname2, lastname: lastname2})
        let user2 = await User.findOne({firstname, lastname})
        let transaction = {}
        if(user1.role[0] === 'เกษตรกร') {
            transaction = {
                source: {
                    name: req.body.source.name,
                    certification: req.body.source.certification
                },
                rubberType: req.body.rubberType,
                volume: req.body.volume,
                price: req.body.price,
                destination: {
                    name: req.body.destination,
                    certification: user2.cert_1
                },
            }
        } else if(user1.role[0] === 'พ่อค้าคนกลาง') {
            transaction = {
                source: {
                    name: req.body.destination,
                    certification: user2.cert_1
                },
                rubberType: req.body.rubberType,
                volume: req.body.volume,
                price: req.body.price,
                destination: {
                    name: req.body.source.name,
                    certification: req.body.source.certification
                },
            }
        }
        const newTransaction = new Transaction(transaction)
        const lastState = newTransaction.destination.name
        const rubberType = newTransaction.rubberType
        newTransaction.save()
        .then(() => {
            Transaction.findOne({rubberType, destination: req.body.source.name})
            .then(transaction => {
                // console.log(transaction)
                if(transaction != null) {
                    // console.log('Update Block ', rubberType)
                    // console.log(transaction.source, ' -> ', transaction.destination)
                    Block.find({lastState: transaction.destination.name, rubberType})
                    .then(blocks => {
                        // console.log(blocks)
                        blocks.map(obj => {
                            obj.holders.push(newTransaction.destination.name)
                            obj.chain.push(newTransaction)
                            obj.lastState = newTransaction.destination.name
                            obj.save()
                        })
                    })
                } else {
                    // console.log('new Block')
                    let chain = []
                    let holders = []
                    chain.push(newTransaction)
                    if(!holders.includes(newTransaction.source.name)){
                        holders.push(newTransaction.source.name)
                        }
                        if(!holders.includes(newTransaction.destination.name)){
                            holders.push(newTransaction.destination.name)
                        }   
                        const newBlock = new Block({lastState, rubberType, chain, holders})
                        newBlock.save()
                    }
                    res.json('Transaction added!')
                })
            })
            .catch(err => res.status(400).json('Error: ' + err))
    }  catch {
        res.status(400).json('ไม่มีผู้ใช่นี้ในระบบ')
    }
});

router.route('/').get((req, res) => {
    Transaction.find()
                .then(transactions => res.json(transactions))
                .catch(err => res.status(400).json('Error: ' + err))
})

router.route('/blocks').get((req, res) => {
    Block.find({})
        .then(blocks => {
            res.json(blocks)
        })
        .catch(err => res.status(400).json('Error: ' + err))
})
router.route('/blocks/:firstname/:lastname').get((req, res) => {
    const fullname = req.params.firstname + ' ' + req.params.lastname
    Block.find({holders: fullname})
        .then(blocks => { 
            res.json(blocks) 
        })
        .catch(err => res.status(400).json('Error: ' + err))
})

router.route('/:firstname/:lastname').get( async (req, res) => {
    const fullname = req.params.firstname + ' ' + req.params.lastname
    let saleList = []
    let buyList = []
    try {
        const sale = await Transaction.find({'source.name': fullname})
        const buy = await Transaction.find({'destination.name': fullname})
        sale.map(transaction => {
            saleList.push(transaction)
        })
        
        buy.map(transaction => {
            buyList.push(transaction)
        })
        
        res.json({sale: saleList, buy: buyList})
    } catch(error) {
        res.status(400).json('Error: ' + error)
    }
})

module.exports = router;