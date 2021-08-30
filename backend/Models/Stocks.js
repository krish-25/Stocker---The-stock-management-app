const mongoose = require('mongoose');

const bsoSchema = new mongoose.Schema({
    length: { type:String },
    quantity: { type:Number }
});

const dsoSchema = new mongoose.Schema({
    length: { type:String },
    quantity: { type:Number }
});

const mainSchema = new mongoose.Schema({
    otype: { type:String },
    bso: [ bsoSchema ],
    dso: [ dsoSchema ]
})

module.exports = mongoose.model('MyStock', mainSchema);