let gameData = {
    currentTurn: 0,
    playersFinished: [false, false],
    players: [
        {
            id: "1",
            color: "#ff0000"
        },
        {
            id: "2",
            color: "#ff0000"
        }
    ],
}

function getYear(){
    return Math.floor(gameData.currentTurn / 4) + 550;
}
function getDate(){
    var i = (gameData.currentTurn + 4) % 4;

    return ["Spring", "Summer", "Autumn", "Winter"][i];
}