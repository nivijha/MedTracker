const {Schema,model} = require('mongoose')

const medicationSchema = new Schema({

    medicineName:{
        type:String,
        required:true,  
    },
    dosage:{
        type:String,
    },
    frequency:{
        type:String,
    },
    startDate:{
        type:Date,
    },
    endDate:{
        type:Date,  
    },
    notes:{
        type:String,
    }
}
)
const Medication= model('medication',medicationSchema)

module.exports = Medication;