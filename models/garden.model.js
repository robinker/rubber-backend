const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gardaenSchema = new Schema({
    id: {
        type: Number,
        unique: true,
        required: true,
    },
    
    rubberType : {
        enum: String,
        required: true,
    },

    area: {
        type: Number,
        required: true,
    },

    rubberTree: {
        type: Number,
        required: true,
    },

    // address: {
        
    // },

    // rubberProducts: {

    // }

}, {
    timestamps: true,
});

const Garden = mongoose.model('Garden', gardaenSchema);

module.exports = Garden;