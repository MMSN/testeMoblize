const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rentSchema = new Schema({
    client: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    car: {
        type: Schema.Types.ObjectId,
        ref: 'projeto',
        required: true
    },
    begindate: {
        type: Date,
        required: true,
    },
    duration: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
}, { versionKey: false });

module.exports = mongoose.model('rent', rentSchema);
