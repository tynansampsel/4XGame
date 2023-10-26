const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ScoreSchema= new Schema({
    score: {
        type: Number,
        required: true
    },
    timestamp: {
        type: String,
        default: Date.now()
    }
})

const Score = mongoose.model("Score", ScoreSchema);
module.exports = Score;