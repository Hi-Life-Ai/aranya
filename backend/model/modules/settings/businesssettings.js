const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const busisetngSchema = new Schema({
    businessname: {
        type: String,
        required: false
    },
    businessid: {
        type: String,
        required: false
    },
    businesslocation:{
        type: String,
        required: false
    },
    startdate: {
        type: String,
        required: false
    },
    dprofitpercent: {
        type: Number,
        required: false
    },
    currency:{
        type: String,
        required: false
    },
    currencysymbol:{
        type: String,
        required: false
    },
    timezone:{
        type: String,
        required: false
    },
    businesslogo:{
        type: String,
        required: false
    },
    fyearsstartmonth:{
        type: String,
        required: false
    },
    stockaccountmethod:{
        type: String,
        required: false
    },
    dateformat:{
        type: String,
        required: false
    },
    timeformat:{
        type: String,
        required: false
    },
    skuprefix:{
        type: String,
        required: false
    },
    credeitlimit:{
        type: Number,
        required: false 
    },
    purchasesku:{
        type: String,
        required: false
    },
    purchasereturnsku:{
        type: String,
        required: false
    },
    purchaseordersku:{
        type: String,
        required: false
    },
    expensesku:{
        type: String,
        required: false
    },
    customersku:{
        type: String,
        required: false
    },
    suppliersku:{
        type: String,
        required: false
    },
    cusgroupsku:{
        type: String,
        required: false
    },
    businesslocationsku:{
        type: String,
        required: false
    },
    usersku:{
        type: String,
        required: false
    },
    salesku:{
        type: String,
        required: false
    },
    draftsku:{
        type: String,
        required: false
    },
    quotationsku:{
        type: String,
        required: false,
    },
    
    buniessaddress:{
        type:String,
        required: false
    },
    ciono:{
        type:Number,
        required: false
    },
    gstno:{
        type:Number,
        required: false
    },
    discountsku:{
        type:String,
        required:false
    },
    applicabletax:{
        type:String,
        required: false
    },
    departmentsku:{
        type:String,
        required:false
    },
    passwordsku:{
        type:String,
        required:false
    },
    multivalue:{
        type:String,
        required: false
    },
    sellingpricetax:{
        type:String,
        required: false
    },
    minquantity:{
        type:Number,
        required: false
    },
    maxquantity:{
        type:Number,
        required: false
    },
    expiryday:{
        type:Number,
        required: false
    },
    defaultunit:{
        type:String,
        required: false
    },
    company:[
        {
            companyid:{
                type:String,
                required: false
            },
            companyname:{
                type:String,
                required: false
            },
            companyaddress:{
                type:String,
                required: false
            },
            bankname:{
                type:String,
                required: false
            },
            accountnumber:{
                type:String,
                required: false
            },
            ifsccode:{
                type:String,
                required: false
            },
            gstno:{
                type:String,
                required: false
            },

        },
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('Busisetng', busisetngSchema);