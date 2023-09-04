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
    taxrate:{
        type: Number,
        required: false
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
    taxrateone:{
        type: String,
        required: false
    },
    taxtype:{
        type: String,
        required: false
    },
    fortaxgonly:{
        type:Boolean,
        required: false
    },
    taxtotal:{
        type: Number,
        required: false
    },
    hsn:{
        type: Number,
        required: false
    },
    hsnsubtax:{
        type: [String],
        required: false
    },
    hsntotal: {
        type: Number,
        required: false
    },
    hsntaxrate:{
        type: String,
        required: false
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Taxrate', taxrateSchema);