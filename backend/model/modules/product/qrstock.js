const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const QrSchema = new Schema({

    lastqrno:{
        type:String,
        required:false
    },
    assignbusinessid:{
        type: String,
        required: false
    },
    qrstock:{
        type:String,
        required:false
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
  
})
module.exports = mongoose.model('Qrno', QrSchema);