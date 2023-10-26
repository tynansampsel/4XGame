//const mapData = require("./mapData.json");

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var brush = 0;

//keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
var cursors;
var brushObject;
var scaleRate = 1;
let xStart = 64;
let yStart = 64;
var offset = {
    x: 0,
    y: 0
}

var mapSize = {
    x: 10,
    y: 10
}

var game = new Phaser.Game(config);

function preload() {
    this.load.image('hex_grassland', 'assets/tiles/hex_grassland_small.png');
    this.load.image('hex_desert', 'assets/tiles/hex_desert_small.png');
    this.load.image('hex_ocean', 'assets/tiles/hex_ocean_small.png');
    this.load.image('test_tile', 'assets/tiles/test_tile.png');
}

function createRandomMap() {
    mapData = [];

    for (var y = 0; y < mapSize.x; y++) {
        for (var x = 0; x < mapSize.y; x++) {
            mapData.push(
                {
                    biome: randomBiome(),
                    x: x,
                    y: y
                }
            )
        }
    }

    console.log(mapData);
}

var button;


function create() {
    //createRandomMap();

    this.input.keyboard.on('keydown-E', event => {
        console.log("E");
        brush++;
        if (brush > 2) brush = 0;
    });

    this.input.keyboard.on('keydown-R', event => {
        console.log("R - SAVED");
    });


    //cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys('Q,E');

    

    mapData.forEach(hex => {
        placeTile(hex.x, hex.y, xStart + 56 * hex.x, yStart + 48 * hex.y, hex.y % 2, hex.biome, this)
        //placeTile(xStart + 58 * hex.x, yStart + 50 * hex.y, hex.y % 2, hex.biome, this)
    })

    brushObject = this.add.image(700, 500,"hex_grassland");


    /*
    this.cameras.main.zoom = 1;

    let xStart = 64;
    let yStart = 64;

    let isOdd;

    let xpos = xStart;
    let ypos = yStart;

    for(var y = 0; y < mapSize.x; y++){
        for(var x = 0; x < mapSize.y; x++){

            placeTile(xpos, ypos, isOdd, this);
            xpos += 58* scaleRate;

        }

        ypos += 50 * scaleRate;
        xpos = xStart;
        isOdd = !isOdd;
    }
    */
}

function randomBiome() {
    var r = Math.round(Math.random() * 3);
    switch (r) {
        case 0:
            return "grassland"
        case 1:
            return "grassland"
        case 2:
            return "desert"
        case 3:
            return "ocean"
    }
}

function placeTile(x, y, xpos, ypos, isOdd, biome, crt) {

    var r = Math.round(Math.random() * 3);

    //crt.add.image(xpos + (isOdd ? 29* scaleRate : 0) + offset.x, ypos + offset.y, 'test_tile');
    let b = crt.add.image(xpos + (isOdd === 1 ? 28 : 0) + offset.x, ypos, 'hex_' + biome).setInteractive();

    b.on('pointerdown', () => {
        console.log("clicked: " + x + "-" +y)

        switch (brush) {
            case 0:
                b.setTexture('hex_grassland')
                break;
            case 1:
                b.setTexture('hex_desert')
                break;
            case 2:
                b.setTexture('hex_ocean')
                break;
        }
    })
}

function update() {
    switch (brush) {
        case 0:
            brushObject.setTexture('hex_grassland')
            break;
        case 1:
            brushObject.setTexture('hex_desert')
            break;
        case 2:
            brushObject.setTexture('hex_ocean')
            break;
    }
}

