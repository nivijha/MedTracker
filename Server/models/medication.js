const { Schema, model } = require("mongoose");

const medicationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  medicineName: {
    type: String,
    required: true,
  },
  dosage: {
    type: String,
  },
  frequency: {
    type: String,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  notes: {
    type: String,
  },
});
const Medication = model("Medication", medicationSchema);

module.exports = Medication;
