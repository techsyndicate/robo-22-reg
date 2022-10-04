const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const reqString = { type: String, required: true };

const indiSchema = new Schema(
    {
        name: reqString,
        dob: reqString,
        email: reqString,
        phone: reqString,
        grade: reqString,
        schname: reqString,
        selected: [reqString],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Indipendant", indiSchema);
