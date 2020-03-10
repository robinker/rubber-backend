const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gardaenSchema = new Schema({
    
    
    area: {
        type: Number,
        required: true,
    },
    startYear: {
        type: Number,
        required: true
    },
    
    species : {
        type: String,
        required: true,
    },

    amount: {
        type: Number,
        required: true,
    },

    address: String,
    subdistrict: String,
    district: String,
    province: String,
    zipcode: String,

    products: [String]

}, {
    timestamps: true,
});

const Garden = mongoose.model('Garden', gardaenSchema);

module.exports = Garden;