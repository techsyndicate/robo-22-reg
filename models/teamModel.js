const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const reqString = { type: String, required: true };
const reqNumber = { type: Number, required: true };
const nonReqString = { type: String };

const teamSchema = new Schema(
  {
    schId: reqString,
    schName: reqString,
    creativeparticipant1: nonReqString,
    creativeparticipant2: nonReqString,
    creativeparticipant3: nonReqString,
    creativeparticipant4: nonReqString,
    creativeparticipant5: nonReqString,
    creativeparticipant6: nonReqString,
    crossparticipant1: nonReqString,
    crossparticipant2: nonReqString,
    gdparticipant1: nonReqString,
    surpparticipant1: nonReqString,
    surpparticipant2: nonReqString,
    progparticipant1: nonReqString,
    progparticipant2: nonReqString,
    filmparticipant1: nonReqString,
    filmparticipant2: nonReqString,
    filmparticipant3: nonReqString,
    filmparticipant4: nonReqString,
    gamingparticipant1: nonReqString,
    gamingparticipant2: nonReqString,
    quizparticipant1: nonReqString,
    roboticsparticipant1: nonReqString,
    roboticsparticipant2: nonReqString,
    roboticsparticipant3: nonReqString,
    photoparticipant1: nonReqString,
    paintparticipant1: nonReqString,
    gamedevparticipant1: nonReqString,
    gamedevparticipant2: nonReqString,
    minecraftparticipant1: nonReqString,
    minecraftparticipant2: nonReqString,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Team", teamSchema);
