const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/4xgame",{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("connected to db"))
    .catch(console.error);

const Score = require('./models/Score');

app.get('/scores', async (req, res) => {
    const scores = await Score.find();
    res.json(scores);
})

app.post('/scores/new', (req, res) => {
    console.log("beep")
    const newScore = new Score({
        score: req.body.score
    })

    newScore.save();

    res.json(newScore);
})

app.listen(3001, () => console.log("server started on 3001"));

