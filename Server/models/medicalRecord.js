const { Schema, model } = require("mongoose");

const medicalRecordSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    title: {
      type: String,
    },
    type: {
      type: String,
    },
    description: {
      type: String,
    },
    fileURL: {
      type: String,
    },
    docName: {
      type: String,
    },
  },
  { timestamps: true }
);

const MedicalRecord = model("MedicalRecord", medicalRecordSchema);

module.exports = MedicalRecord;
