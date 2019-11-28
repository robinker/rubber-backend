const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    
    source: {
        type: String,
        required: true,
    },
    
    rubberType : {  
        type: String,
        required: true,
    },
    
    volume: {
        type: Number,
        required: true,
    },

    price: {
        type: Number,
        required: true,
    },
    
    destination: {
        type: String,
        required: true,
    },


}, {
    timestamps: true,
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;