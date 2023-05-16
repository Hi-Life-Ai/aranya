const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const draftSchema = new Schema({

    assignbusinessid: {
        type: String,
        required: false
    },
    referenceno: {
        type: String,
        required: false,
    },
    date: {
        type: String,
        required: false,
    },
    goods: [
        {
            businesslocation: {
                type: String,
                required: false
            },
            productname: {
                type: String,
                requried: false,
            },
            quantity: {
                type: Number,
                requried: false,
            },
            productid: {
                type: String,
                requried: false,
            },
            taxtareval: {
                type: Number,
                requried: false,
            },
            category: {
                type: String,
                requried: false,
            },
            subcategory: {
                type: String,
                requried: false,
            },
            applicabletax: {
                type: String,
                requried: false,
            },
            hsn: {
                type: String,
                requried: false,
            },
            sellingpricetax: {
                type: String,
                requried: false,
            },
            discountamt: {
                type: Number,
                requried: false,
            },
            subtotal: {
                type: Number,
                requried: false,
            },
            companyrate: {
                type: Number,
                required: false
            },
            superstockrate: {
                type: Number,
                required: false
            },
            dealerrate: {
                type: Number,
                required: false
            },
            mrp: {
                type: Number,
                required: false
            },
            sellingvalue: {
                type: Number,
                required: false
            },
            ratetype: {
                type: String,
                required: false
            },
            afterdiscount: {
                type: Number,
                required: false
            },
            discountcheck: {
                type: Boolean,
                require: false
            },
            netrate: {
                type: Number,
                required: false
            },
            expirydate: {
                type: String,
                required: false
            },
            subtax: [{
                taxratecgst: {
                    type: String,
                    required: false
                },
                taxrategst: {
                    type: String,
                    required: false
                },
                taxrateigst: {
                    type: String,
                    required: false
                }
            },]

        }
    ],
    totalitems: {
        type: Number,
        required: false,
    },
    totalproducts: {
        type: Number,
        required: false
    },
    grandtotal: {
        type: Number,
        required: false,
    },
    taxcgst:{
        type: Number,
        required: false
    },
    taxigst:{
        type: Number,
        required: false
    },
    taxsgst:{
        type: Number,
        required: false
    },
    totalbillamt: {
        type: Number,
        required: false,
    },
    userbyadd: {
        type: String,
        required: false
    },
    //own company
    company: {
        type: String,
        required: false
    },
    companyaddress: {
        type: String,
        required: false
    },
    companycontactpersonname: {
        type: String,
        required: false
    },
    companycontactpersonnumber: {
        type: Number,
        required: false
    },
    gstn: {
        type: String,
        required: false
    },
    bankname: {
        type: String,
        required: false
    },
    accountnumber: {
        type: String,
        required: false
    },
    ifsccode: {
        type: String,
        required: false
    },
    //Delivery
    location: {
        type: String,
        required: false
    },
    deliveryaddress: {
        type: String,
        required: false
    },
    deliverygstn: {
        type: String,
        required: false
    },
    deliverycontactpersonname: {
        type: String,
        required: false
    },
    deliverycontactpersonnumber: {
        type: Number,
        required: false
    },
    //transport
    drivername: {
        type: String,
        required: false
    },
    drivernumber: {
        type: String,
        required: false
    },
    drivernphonenumber: {
        type: Number,
        required: false
    },
    //salesman
    salesman: {
        type: String,
        required: false
    },
    salescommission: {
        type: Number,
        required: false
    },
    salesmannumber: {
        type: Number,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

module.exports = mongoose.model('Draft', draftSchema);