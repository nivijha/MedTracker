const {Schema,model} = require('mongoose')

const prescriptionSchema = new Schema({

    doctorName:{
        type:String,
    },
    clinic:{
        type:String,
    },
    dateIssued:{
        type:Date,
        default:Date()
    },
    notes:{
        type:String,
    },
    medicines:{
        type:Array,

    }
})

const Prescription = model('prescription',prescriptionSchema)

module.exports = Prescription;