const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const taxrateSchema = new Schema({
    assignbusinessid:{
        type: String,
        required: false
    },
    taxname:{
        type: String,
        required: [false, 'Please enter tax name']
    },
    taxrategst:{
        type: Number,
        required: false
    },
    taxratecgst:{
        type: Number,
        required: false
    },
    taxrateigst:{
        type: Number,
        required: false
    },
    taxtotal:{
        type: Number,
        required: false
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Taxrate', taxrateSchema);