const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    
    source: {
        name: String,
        certification: String,
        type: Object,
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
        name: String,
        certification: String,
        type: Object,
        required: true,
    },

    // date: {
    //     type: Date,
    //     required: true
    // }


}, {
    timestamps: true,
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;