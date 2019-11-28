const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    username: {
        type: String,
        require: true,
        unique: true,
        trim: true,
        minlength: 3
    },

    password: {
        type: String,
        required: true,
    },

    role : {
        type: ['Administrator', 'Gardener', 'Middleman'],
        default: 'Gardener',
        required: true,
    },

    // citizen_id: {
    //     type: String,
    //     require: true,
    //     unique: true,
    //     minlength: 13,
    //     maxlength: 13,
    // },

    firstname: {
        type: String,
        required: true,
    },

    lastname: {
        type: String,
        required: true,
    },
    
    // certifitions: {
    //     cer_1: {
    //         type: String
    //     }, 
    //     cer_2 : {
    //         type: String
    //     },
    //     cer_3 : {
    //         type: String
    //     },
    //     cer_4: {
    //         type: String
    //     },
    // },

    // gardens: {
    //     type: [mongoose.Schema.Types.ObjectId],
    //     ref: 'Garden',
    //     required: true,
    // }

    // transactions: {
    //     type: [Schema.Types.ObjectId],
    //     ref: 'Transaction'
    // }

}, {
    timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;