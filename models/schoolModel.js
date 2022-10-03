const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const reqString = { type: String, required: true };
const nonReqString = { type: String, required: false };

const schoolSchema = new Schema(
  {
    schoolName: reqString,
    schoolAddress: reqString,
    schoolEmail: reqString,
    clubName: nonReqString,
    clubEmail: nonReqString,
    clubWebsite: nonReqString,
    teacherName: reqString,
    teacherEmail: reqString,
    teacherPhone: reqString,
    studentName: reqString,
    studentEmail: reqString,
    studentPhone: reqString,
    userId: reqString,
    pass: reqString,
    discordCode: reqString,
  },
  { timestamps: true }
);

module.exports = mongoose.model("School", schoolSchema);
