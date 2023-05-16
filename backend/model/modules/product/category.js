const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const categorySchema = new Schema({
    categoryname:{
        type: String,
        required: false
    },
    categorycode:{
        type: String,
        required: false
    },
    categorydescription:{
        type: String,
        required: false
    },
    assignbusinessid:{
        type: String,
        required: false
    },
    subcategories:[
        {
            subcategryname:{
                type: String,
                required: false
            },
            subcategrycode:{
                type: String,
                required: false
            }
        }
    ],
    createdAt:{
        type: Date,
        default: Date.now
    },
})
module.exports = mongoose.model('Category', categorySchema);