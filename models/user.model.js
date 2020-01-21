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
        type: ['ผู้ดูแลระบบ', 'เกษตรกร', 'พ่อค้าคนกลาง'],
        default: 'เกษตรกร',
        required: true,
    },

    citizen_id: {
        type: String,
        // require: true,
        unique: true,
        minlength: 13,
        maxlength: 13,
    },

    firstname: {
        type: String,
        required: true,
    },

    lastname: {
        type: String,
        required: true,
    },
    
    cert_1: {
        type: String
    }, 
    cert_2 : {
        type: String
    },
    cert_3 : {
        type: String
    },
    cert_4: {
        type: String
    },

    // gardens: {
    //     type: [mongoose.Schema.Types.ObjectId],
    //     ref: 'Garden',
    //     required: true,
    // },

    friendlist: {
        type: [String]
    }

}, {
    timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;