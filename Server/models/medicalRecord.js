const {Schema,model} = require('mongoose')

const medicalRecordSchema = new Schema({

    title:{
        type:String,
    },
    type:{
        type:String,
    },
    description:{
        type:String,
    },
    fileURL:{
        type:String,
    },
    docName:{
        type:String,
    },
},{timestamps:true}
)

const MedicalRecord = model('medicalRecord',medicalRecordSchema)

module.exports = MedicalRecord;