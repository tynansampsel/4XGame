var brushObject;
var mapMode = true;


var selectedTile = -1;
var selectedId;
var selectedTileHighlight;
var cursorIsOnCanvas = true;
brush = 0;

var hexFeatures = {
    id: "",
    feature: "",
    owner: ""
}
camera = null;
camZoom = 1;

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
            x: 240,
            y: 160
        }
        this.xStart = 75; //-3500 
        this.yStart = 78; //-2000 //
    }

    init() {

    }

    preload() {
        this.load.script('noise', './noise.js');
        this.load.image('hex_grassland', 'assets/tiles/hex_grassland_small.png');
        this.load.image('hex_desert', 'assets/tiles/hex_desert_small.png');
        this.load.image('hex_ocean', 'assets/tiles/hex_ocean_small.png');
        this.load.image('hex_black', 'assets/tiles/hex_black_small.png');
        this.load.image('test_tile', 'assets/tiles/test_tile.png');

        this.load.image('structure_city', 'assets/tiles/structure_city_small.png');
        this.load.image('structure_mine', 'assets/tiles/structure_mine_small.png');
        this.load.image('structure_farm', 'assets/tiles/structure_farm_small.png');
        
        // this.load.image('ui_tool', 'assets/tiles/ui_tool.png');
        // this.load.image('ui_bottom_bar', 'assets/ui/ui_bottom_bar.png');
        // this.load.image('ui_top_bar', 'assets/ui/ui_top_bar.png');
        // this.load.image('button_arrow', 'assets/ui/button_arrow.png');

        // this.load.image('icon_settlers', 'assets/ui/icon_settlers.png');
        // this.load.image('icon_farm', 'assets/ui/icon_farm.png');
        // this.load.image('icon_mine', 'assets/ui/icon_mine.png');

        this.load.image('cursor_default', 'assets/ui/cursor_default.png');

        this.load.image('city_range_1', 'assets/tiles/city_range_1.png');
        this.load.image('hex_highlight', 'assets/ui/hexhighlight.png');

    }

    create() {
        camera = this.cameras.main;
        //this.scale.startFullscreen();
        camera.zoom = 1;

        var canvas = this.sys.game.canvas;

        // set up canvas event listeners
        canvas.addEventListener('mouseenter', function () {
            cursorIsOnCanvas = true;
            console.log("in")
        });
    
        canvas.addEventListener('mouseleave', function () {
            cursorIsOnCanvas = false;
            console.log("out")
        });

        this.hexes = this.add.group();
        this.cities = this.add.group();
        
        this.input.setDefaultCursor('url(assets/ui/cursor_default.png), pointer');
        
        this.createRandomMap();
        //this.add.image(20  + this.offset.x, 20, 'hex_' + "ocean").setInteractive();

        

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
        this.input.on('wheel', event => {
            console.log(event.deltaY)

            camZoom += -(event.deltaY / 1000);

            camZoom = Phaser.Math.Clamp(camZoom, 0, 2);
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
        //this.add.image(400, 551,"ui_bottom_bar");
        //this.add.image(400, 10,"ui_top_bar");

        // var nextTurnButton = this.add.image(700, 551,"button_arrow").setInteractive();

        // nextTurnButton.on('pointerdown', () => {
        //     gameData.playersFinished[0] = true;
        //     gameData.playersFinished[1] = true;
        //     this.endTurn();
        // })

        //brushObject = this.add.image(85, 551,"hex_grassland");
        selectedTileHighlight = this.add.image(85, 551,"hex_highlight");
        
        //console.log(getYear());
        console.log(getDate());

        

        this.input.on('pointermove', function (pointer) {
            
        });

        this.input.keyboard.on('keydown-D', event => {
            camera.scrollX += 5;
            console.log("cam");

        });
    }

    update() {
        if(selectedTile != -1){
            //camera.setPosition(50, 50);
            //camera.startFollow(selectedTileHighlight);
        }
        this.updateCamera()

        if(event_nextTurn){
            event_nextTurn = false;
            this.endTurn();
        }

        if(selectedTile != -1){
            var hex = getHexData(selectedTile);

            switch (hex.biome) {
                case 0:
                    break;
                case 1:
                    break;
            }
        }

        
    }

    updateCamera(){
        if(!cursorIsOnCanvas) return;
        const pointer = this.input.activePointer;

        if(pointer.y > camera.height - 100) return;

        camera.zoom = camZoom;

        const cameraSpeed = 4;
        const edgeThreshold = 100;
        // Check if the mouse is near the edges
        const nearTop = pointer.y < (edgeThreshold+25) && pointer.y > 25;
        const nearBottom = pointer.y > camera.height - (edgeThreshold+ 100 ) && pointer.y < camera.height - 100;
        const nearLeft = pointer.x < edgeThreshold;
        const nearRight = pointer.x > camera.width - edgeThreshold;
    
        // Adjust the camera position based on the mouse position and edges
        if (nearTop) {
            camera.scrollY -= cameraSpeed;
        }
        if (nearBottom) {
            camera.scrollY += cameraSpeed;
        }
        if (nearLeft) {
            camera.scrollX -= cameraSpeed;
        }
        if (nearRight) {
            camera.scrollX += cameraSpeed;
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

        // turnText.setText('Turn: '+gameData.currentTurn);
        // dateText.setText(getDate()+', '+getYear()+'AD');
    }

    randomBiome(x, y, noise) {
        const zoom = 10
        let v = noise.perlin2(x/zoom, y/zoom);
        v = (v + 1) / 2;

        let oceanlevel = 0.55;
        let grasslevel = 0.6;

        if (v < oceanlevel){
            return "ocean"
        } else if (v >= oceanlevel && v <= grasslevel){
            return "desert"
        } else if (v > grasslevel){
            return "grassland"
        } else{
            return "black"
        }

        // var r = Math.round(Math.random() * 3);
        // switch (r) {
        //     case 0:
        //         return "grassland"
        //     case 1:
        //         return "grassland"
        //     case 2:
        //         return "desert"
        //     case 3:
        //         return "ocean"
        // }
    }

    

    createRandomMap() {
        mapData = [];
        const noise = new Noise();
        for (var y = 0; y < this.mapSize.y; y++) {
            for (var x = 0; x < this.mapSize.x; x++) {
                mapData.push(
                    {
                        id: (x+"-"+y),
                        biome: this.randomBiome(x, y, noise),
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
                name: "",
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