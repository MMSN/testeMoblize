const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    cpf: {
        type: String,
        required: true,
        unique: true,
    },
    telefone: {
        type: String,
        required: true,
    },
    birthdate: {
        type: Date,
        required: true,
    },
    rents: [{
        type: Schema.Types.ObjectId,
        ref: 'rent'
    }],
}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);