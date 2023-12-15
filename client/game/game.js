//const mapData = require("./mapData.json");

var config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    width: 800,
    height: 600,
    backgroundColor: '#392711',
    scene: [HexTileMap]//[WorldMap, Ui]
};

//scene: [WorldMap, Ui]
var game = new Phaser.Game(config);

