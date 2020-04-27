const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PriceSchema = new Schema({
    name: String,
    price: Number
}, {
    timestamps: true,
})

const Price = mongoose.model('Price', PriceSchema);

module.exports = Price;