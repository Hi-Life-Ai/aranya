
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const stockSchema = new Schema({
    products:[
        {
            alpharate:{
                type:String,
                required: false
            },
            businesslocation:{
                type:String,
                required: false
            },
            brand:{
                type:String,
                required: false
            },
            businessname:{
                type:String,
                required: false
            },
            category:{
                type:String,
                required: false
            },
            productname:{
                type:String,
                required: false
            },
            sellingprice:{
                type:Number,
                required: false
            },
            size:{
                type:String,
                required: false
            },
            sku:{
                type:String,
                required: false
            },
            stockid:{
                type:String,
                required: false
            },
            subcategory:{
                type:String,
                required: false
            },
            purchasedate:{
                type:String,
                required: false
            },
            applicabletax:{
                type:String,
                required: false
            },
            sellingpricetax:{
                type:String,
                required: false
            },
            labelstatus:{
                type:String,
                required: false
            },
            salestatus:{
                type:String,
                required: false
            },
        }
    ],
    assignbusinessid:{
        type: String,
        required: false
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
})
module.exports = mongoose.model('Stock', stockSchema);