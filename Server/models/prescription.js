const { Schema, model } = require("mongoose");

const embeddedPrescription = new Schema({
    medicineName:{
        type:String
    },
    dosage:{
        type:String
    },
    frequency:{
        type:String
    },
    duration:{
        type:String
    }
        
})

const prescriptionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  doctorName: {
    type: String,
  },
  clinic: {
    type: String,
  },
  dateIssued: {
    type: Date,
    default: Date(),
  },
  notes: {
    type: String,
  },
  medicines:[embeddedPrescription],
});

const Prescription = model("prescription", prescriptionSchema);

module.exports = Prescription;
