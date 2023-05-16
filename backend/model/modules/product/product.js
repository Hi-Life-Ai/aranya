const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const productSchema = new Schema({

    category: {
        type: String,
        required: false
    },
    subcategory: {
        type: String,
        required: false
    },
    productname: {
        type: String,
        required: false
    },
    sku: {
        type: String,
        required: false
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
    hsn:{
        type: String,
        required: false
    },
    labeltype: {
        type: String,
        required: false
    },
    expirydate: {
        type: String,
        required: false
    },
    unit:  {
        type: String,
        required: false
    },
    currentstock:{
        type: Number,
        required: false
    },
    managestock:  {
        type: Boolean,
        required: false
    },
    minquantity: {
        type: Number,
        required: false
    },
    maxquantity: {
        type: Number,
        required: false
    },
    productdescription:  {
        type: String,
        required: false
    },
    productimage:  {
        type: String,
        required: false
    },
    applicabletax: {
        type: String,
        required: false
    },
    sellingpricetax: {
        type: String,
        required: false
    },
    assignbusinessid:{
        type: String,
        required: false
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
})
module.exports = mongoose.model('Product', productSchema);
