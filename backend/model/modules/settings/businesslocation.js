const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const busilocSchema = new Schema({
    name:{
        type: String,
        required: false
    },
    assignbusinessid:{
        type: String,
        required: false
    },
    locationid:{
        type: String,
        required: false
    },
    landmark:{
        type: String,
        required: false
    },
    city:{
        type: String,
        required: false
    },
    zipcde:{
        type: String,
        required: false
    },
    state:{
        type: String,
        required: false
    },
    country:{
        type: String,
        required: false
    },
    phonenumber:{
        type: Number,
        required: false
    },
    
    landlinenumber:{
        type: Number,
        required: false
    },
    onephonenumber:{
        type:Number,
        maxLength:[10 , 'Phone number cannot more than 10 charecters'],
        required:false

    },
    twophonenumber:{
        type:Number,
        maxLength:[10 , 'Phone number cannot more than 10 charecters'],
        required:false

    },
    threephonenumber:{
        type:Number,
        maxLength:[10 , 'Phone number cannot more than 10 charecters'],
        required:false

    },
    email:{
        type: String,
        required: false
    },
    website:{
        type: String,
        required: false
    },
    
    activate:{
        type: Boolean,
        required: false
    },
    whatsappno:{
        type:Number,
        maxLength:[10 , 'Phone number cannot more than 10 charecters'],
        required:false
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Businesslocation', busilocSchema);