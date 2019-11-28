const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blockSchema = new Schema({
    
    lastState: {
        type: String,
        required: true
    },

    rubberType: {
        type: String
    },
    
    chain : {  
        type: [],
        required: true,
    },

}, {
    timestamps: true,
});

const Block = mongoose.model('Block', blockSchema);

module.exports = Block;