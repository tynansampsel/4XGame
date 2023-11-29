var brushObject;
var mapMode = true;

var selectedCity;
var selectedTile = -1;
var selectedId;
var selectedTileHighlight;

brush = 0;

var hexFeatures = {
    id: "",
    feature: "",
    owner: ""
}

var turnText;
var dateText;

var dates = [ "Spring", "Summer"]

class WorldMap extends Phaser.Scene {
    #scaleRate = 1;



    constructor() {
        super("worldMap")
        this.offset = {
            x: 0,
            y: 0
        }
        this.mapSize = {
            x: 12,
            y: 8
        }
        this.xStart = 75; //-3500
        this.yStart = 78; //-2000
    }

    init() {

    }

    preload() {
        this.load.image('hex_grassland', 'assets/tiles/hex_grassland_small.png');
        this.load.image('hex_desert', 'assets/tiles/hex_desert_small.png');
        this.load.image('hex_ocean', 'assets/tiles/hex_ocean_small.png');
        this.load.image('test_tile', 'assets/tiles/test_tile.png');

        this.load.image('structure_city', 'assets/tiles/structure_city_small.png');
        this.load.image('structure_mine', 'assets/tiles/structure_mine_small.png');
        this.load.image('structure_farm', 'assets/tiles/structure_farm_small.png');
        
        this.load.image('ui_tool', 'assets/tiles/ui_tool.png');
        this.load.image('ui_bottom_bar', 'assets/ui/ui_bottom_bar.png');
        this.load.image('ui_top_bar', 'assets/ui/ui_top_bar.png');
        this.load.image('button_arrow', 'assets/ui/button_arrow.png');

        this.load.image('icon_settlers', 'assets/ui/icon_settlers.png');
        this.load.image('icon_farm', 'assets/ui/icon_farm.png');
        this.load.image('icon_mine', 'assets/ui/icon_mine.png');

        this.load.image('cursor_default', 'assets/ui/cursor_default.png');

        this.load.image('city_range_1', 'assets/tiles/city_range_1.png');
        this.load.image('hex_highlight', 'assets/ui/hexhighlight.png');

    }

    create() {

        this.scale.startFullscreen();
        this.cameras.main.zoom = 1;

        this.hexes = this.add.group();
        this.cities = this.add.group();
        
        this.input.setDefaultCursor('url(assets/ui/cursor_default.png), pointer');
        
        this.createRandomMap();
        //this.add.image(20  + this.offset.x, 20, 'hex_' + "ocean").setInteractive();

        this.input.keyboard.on('keydown-E', event => {
            console.log("E");
            brush++;
            if (brush > 2) brush = 0;
        });

        this.input.keyboard.on('keydown-Q', event => {
            console.log("switched mode");
            mapMode = !mapMode;
        });

        this.input.keyboard.on('keydown-P', event => {
            console.log("player 2 done");
            gameData.playersFinished[0] = true;
            this.endTurn();

        });
        this.input.keyboard.on('keydown-O', event => {
            console.log("player 2 done");
            gameData.playersFinished[1] = true;
            this.endTurn();

        });
        

        this.keys = this.input.keyboard.addKeys('Q,E');

        mapData.forEach(hex => {

            var isOdd = hex.y % 2;
            var newXPosition = this.xStart + 56 * hex.x + (isOdd === 1 ? 28 : 0) + this.offset.x;
            var newYPosition = this.yStart + 48 * hex.y;
            var image = 'hex_' + hex.biome;

            var newHex = new Hex(this, hex.id, newXPosition, newYPosition);


            //this.placeTile(hex.x, hex.y, this.xStart + 56 * hex.x, this.yStart + 48 * hex.y, hex.y % 2, hex.biome, this)
            //placeTile(xStart + 58 * hex.x, yStart + 50 * hex.y, hex.y % 2, hex.biome, this)
        })

        this.placeRandomCity(1);

        //this.add.image(700, 500,"ui_tool");
        this.add.image(400, 551,"ui_bottom_bar");
        this.add.image(400, 10,"ui_top_bar");

        var nextTurnButton = this.add.image(700, 551,"button_arrow").setInteractive();

        nextTurnButton.on('pointerdown', () => {
            gameData.playersFinished[0] = true;
            gameData.playersFinished[1] = true;
            this.endTurn();
        })

        brushObject = this.add.image(85, 551,"hex_grassland");
        selectedTileHighlight = this.add.image(85, 551,"hex_highlight");
        
        //console.log(getYear());
        console.log(getDate());

        turnText = this.add.text(10, 450, 'Turn: '+gameData.currentTurn, { fontSize: '16px', fill: '#FFF', strokeThickness: 0.5, align: "right" });
        dateText = this.add.text(10, 475, getDate()+', '+getYear()+'AD', { fontSize: '16px', fill: '#FFF', strokeThickness: 0.5, align: "right" });
    }

    update() {

        if(selectedTile != -1){
            var hex = getHexData(selectedTile);

            switch (hex.biome) {
                case 0:
                    break;
                case 1:
                    break;
            }
        }



        if(mapMode){
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
        } else {
            brushObject.setTexture('structure_city')
        }
    }

    moveSelectedTilehighlight(x, y) {
        selectedTileHighlight.setPosition(x, y);
    }

    updateUiCenterBoard(){

    }

    endTurn(){
        var arr = gameData.playersFinished.find((player) => !player);
        //console.log(gameData.playersFinished);

        if(arr == undefined){
            console.log("next turn");

            gameData.currentTurn++;



            this.cities.children.each(city => {
                city.endOfTurnUpdate();
            }, this)


            gameData.playersFinished.forEach((value, index, arr) => {
                arr[index] = false;
            });
        //console.log(gameData);
        } else {
            console.log("player not done");
        }

        turnText.setText('Turn: '+gameData.currentTurn);
        dateText.setText(getDate()+', '+getYear()+'AD');
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
    
        for (var y = 0; y < this.mapSize.y; y++) {
            for (var x = 0; x < this.mapSize.x; x++) {
                mapData.push(
                    {
                        id: (x+"-"+y),
                        biome: this.randomBiome(),
                        features: [],
                        x: x,
                        y: y
                    }
                )
            }
        }
    
        console.log(mapData);

        
    }

    placeRandomCity(playerId){
        var r = Math.round(Math.random() * mapData.length);

        let cityId = cityData.length;
        cityData.push({
            id: cityId,
            name: "nill",
            hex: mapData[r].id,
            owner: playerId,
            buildings: [],
            production: 2,
            food: 0,
            population: 1,
            foodSpentForPopulation: 0,
            currentWork: {
                name: "smithery",
                production: 0
            }
        })

        var newCity = new City(this, cityId, this.getPositionFromIdX(mapData[r].x, mapData[r].y), this.getPositionFromIdY(mapData[r].y));
    }



    getPositionFromIdX(x, y){
        var isOdd = y % 2;
        return this.xStart + 56 * x + (isOdd === 1 ? 28 : 0) + this.offset.x;
    }

    getPositionFromIdY(y){
        return this.yStart + 48 * y;
    }
}