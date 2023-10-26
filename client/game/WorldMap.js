var brushObject;
brush = 0;

class WorldMap extends Phaser.Scene {
    #scaleRate = 1;



    constructor() {
        super("worldMap")
        this.offset = {
            x: 0,
            y: 0
        }
        this.mapSize = {
            x: 10,
            y: 10
        }
        this.xStart = 64;
        this.yStart = 64;
    }

    init() {

    }

    preload() {
        this.load.image('hex_grassland', 'assets/tiles/hex_grassland_small.png');
        this.load.image('hex_desert', 'assets/tiles/hex_desert_small.png');
        this.load.image('hex_ocean', 'assets/tiles/hex_ocean_small.png');
        this.load.image('test_tile', 'assets/tiles/test_tile.png');
        this.load.image('structure_city', 'assets/tiles/structure_city_small.png');
    }

    create() {

        this.hexes = this.add.group();
        //this.createRandomMap();
        //this.add.image(20  + this.offset.x, 20, 'hex_' + "ocean").setInteractive();

        this.input.keyboard.on('keydown-E', event => {
            console.log("E");
            brush++;
            if (brush > 2) brush = 0;
        });

        this.input.keyboard.on('keydown-R', event => {
            console.log("R - SAVED");
        });

        

        this.keys = this.input.keyboard.addKeys('Q,E');

        mapData.forEach(hex => {

            var isOdd = hex.y % 2;
            var newXPosition = this.xStart + 56 * hex.x + (isOdd === 1 ? 28 : 0) + this.offset.x;
            var newYPosition = this.yStart + 48 * hex.y;
            var image = 'hex_' + hex.biome;

            var newHex = new Hex(this, hex.id, hex.x, hex.y, newXPosition, newYPosition, hex.biome);


            //this.placeTile(hex.x, hex.y, this.xStart + 56 * hex.x, this.yStart + 48 * hex.y, hex.y % 2, hex.biome, this)
            //placeTile(xStart + 58 * hex.x, yStart + 50 * hex.y, hex.y % 2, hex.biome, this)
        })

        brushObject = this.add.image(700, 500,"hex_grassland");
        
    }

    update() {
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

    randomBiome() {
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

    

    createRandomMap() {
        mapData = [];
    
        for (var y = 0; y < this.mapSize.x; y++) {
            for (var x = 0; x < this.mapSize.y; x++) {
                mapData.push(
                    {
                        id: (x+"-"+y),
                        biome: this.randomBiome(),
                        structure: "",
                        x: x,
                        y: y
                    }
                )
            }
        }
    
        console.log(mapData);
    }
}