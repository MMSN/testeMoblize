const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const carSchema = new Schema({
    model: {
        type: String,
        required: true
    },
    vrplate: {
        type: String,
        required: true,
        unique: true
    },
    color: {
        type: String,
        required: true
    },
    observation: {
        type: String,
    },
    category: {
        type: String,
        required: true
    },
    rents: [{
        type: Schema.Types.ObjectId,
        ref: 'rent'
    }],
}, { versionKey: false });

module.exports = mongoose.model('car', carSchema);
