let tilemapArr = {};
let camera = null;
let camZoom = 1;
let cameraSpanSpeed = 25;
let cursorIsOnCanvas = true;
let scrollY = 0;
let scrollX = 0;
let seed = 11;

let cursorVariables = {
    currentSelectedTile: "0-0",
    currentSelectedCity: "-1",
    currentHoveringTile: "0-0",
    selectedTileHighlight: null
}

var cityNames = [
    "Berlin",
    "York",
    "Paris",
    "Rome",
    "Venice",
    "Vatican",
    "New York",
    "Jerusalem",
    "Corinth",
    "Athens",
    "Dublin",
    "Moscow",
    "Frankfurt",
    "Hamburg",
    "Troy",
    "Tyre",
    "Babylon",
    "Stockholm",
    "Glasglow",
    "Madrid",
    "Constantinople",
    "London",
] 

class WorldMap extends Phaser.Scene {

    
	constructor() {
		super({ key: "WorldMap" })
	}

    

	preload() {
		this.load.image('tileset_world_base', 'assets/tilesets/tileset_world_base.png');
		this.load.image('tileset_world_structure', 'assets/tilesets/tileset_world_structure.png');
		this.load.tilemapTiledJSON('hexMap', 'json/tilemap.json');
	
        this.load.image('hex_highlight', 'assets/highlight/hexhighlight.png');
    }

	create() {
		camera = this.cameras.main;
		camera.setSize(800, 600);
		camera.zoom = 1;
		let canvas = this.sys.game.canvas;
        
        // const cursors = this.input.keyboard.createCursorKeys();

        // const controlConfig = {
        //     camera: this.cameras.main,
        //     left: cursors.left,
        //     right: cursors.right,
        //     up: cursors.up,
        //     down: cursors.down,
        //     zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
        //     zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
        //     acceleration: 0.06,
        //     drag: 0.0005,
        //     maxSpeed: 0.25
        // };

        // this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);

        // ================================================================
        // ====== Map Setup ===========================================

		const map = this.add.tilemap('hexMap');
		const tileset_world_base = map.addTilesetImage('tileset_world_base', 'tileset_world_base');
		const tileset_world_structure = map.addTilesetImage('tileset_world_structure', 'tileset_world_structure');
		//map.createLayer('tileMap2', tileset);
		const layer_world_base = map.createBlankLayer('world_base', tileset_world_base, 0, 0, 240, 160, 64, 68);
		const layer_world_structure = map.createBlankLayer('world_structure', tileset_world_base, 0, 0, 240, 160, 64, 68);
		
        cursorVariables.selectedTileHighlight = this.add.image(85, 551,"hex_highlight");

		this.fixLayer(layer_world_base, map);
		this.fixLayer(layer_world_structure, map);

		layer_world_base.fill(1, 0, 0, 240, 160)
		layer_world_structure.fill(0, 0, 0, 240, 160)

		this.createRandomMap( map, layer_world_base)
		layer_world_base.setCullPadding(80, 40);
		layer_world_structure.setCullPadding(80, 40);

        // ================================================================
        // ====== Post Map Setup ===========================================

        camera.setBounds(-50, -50, map.widthInPixels+50, map.heightInPixels+50);

        // ================================================================
        // ====== Test Controls ===========================================

		this.input.keyboard.on('keydown-P', event => {
			console.log("map resize");
			const newMapData = {
				width: map.width,
				height: map.height,
				layers: [
					{
						data: map.layers[0].data, // Use the existing tile data
						height: 9,
						width: 5,
					},
				],
			};
			map.setBaseTilemap(newMapData);

			// Resize the layer
			layer.resize(newMapData.width, newMapData.height);
		});

        // ================================================================
        // ====== Mouse Controls ==========================================

		canvas.addEventListener('mouseenter', function () {
			cursorIsOnCanvas = true;
			//console.log("in")
		});

		canvas.addEventListener('mouseleave', function () {
			cursorIsOnCanvas = false;
			//console.log("out")
		});

		this.input.on('wheel', event => {
			camZoom += -((event.deltaY / 1000));
			camZoom = Phaser.Math.Clamp(camZoom, 0.2, 1.5);
		});

        // ================================================================
        // ====== Map Controls ============================================

        this.placeCity(1, 1, 1, map, layer_world_structure);
        map.putTileAt(7, 1, 1, false, layer_world_structure);

        this.placeCity(1, 2, 1, map, layer_world_structure);
        map.putTileAt(7, 2, 1, false, layer_world_structure);

		this.input.on('pointerup', function (pointer) {
			// Calculate the tile coordinates based on the pointer's world position
			//console.log('World Coordinates:', pointer.worldX, pointer.worldY);

			const tileXY = map.worldToTileXY(pointer.worldX, pointer.worldY);
            //const tile = layer_world_structure.getTileAt(pointer.worldX, pointer.worldY)
			console.log(tileXY);
            console.log('PWC', pointer.worldX, pointer.worldY);
            console.log(tileXY)
            const cityTile = cityData.findIndex(city => city.hex === `${tileXY.x}-${tileXY.y}`)
            const hexTile = mapData.findIndex(hex => hex.id === `${tileXY.x}-${tileXY.y}`)
			console.log(cityTile);

            if(cityTile > -1){
                console.log(cityData[cityTile]);
                cursorVariables.currentSelectedCity = cityTile
                console.log(`currently selected tile is ${cursorVariables.currentSelectedCity}`);

            } else if(hexTile > -1){
                console.log("b");

                this.placeCity(1, tileXY.x, tileXY.y, map, layer_world_structure);
                map.putTileAt(7, tileXY.x, tileXY.y, false, layer_world_structure);
            } else {
                console.log("no data found.");
            }

			//console.log(tileXY.x, tileXY.y);
            

            console.log(cityData);
		}, this);



        this.input.on('pointermove', function (pointer) {
			const tileXY = map.worldToTileXY(pointer.worldX, pointer.worldY);
            const worldXY = this.staggeredTileToWorldXY(tileXY.x, tileXY.y, map.tileWidth, map.tileHeight);

            this.moveSelectedTilehighlight(worldXY.x, worldXY.y);
        }, this);

        // highlight = this.add.graphics();

        // drawTileHighlight(1, 1);
	}

    staggeredTileToWorldXY(tileX, tileY, tileWidth, tileHeight) {
        const offsetX = tileY % 2 === 1 ? tileWidth / 2 : 0;
        const worldX = tileX * tileWidth + offsetX + (tileWidth/2);
        const worldY = tileY * (tileHeight * 3 / 4) + (tileHeight/2);
        return new Phaser.Math.Vector2(worldX, worldY);
    }
	update(delta) {
        //this.controls.update(delta);
		this.updateCamera()
	}

    placeCity(playerId, x, y, map, layer){
        var r = Math.round(Math.random() * cityNames.length);
        console.log(r)
        console.log(cityNames[r])
        let rname = cityNames[r]
        let cityId = cityData.length;

        cityData.push({
            id: cityId,
            name: rname,
            hex: `${x}-${y}`,
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
    }

    moveSelectedTilehighlight(x, y) {


        cursorVariables.selectedTileHighlight.setPosition(x, y);
    }

    // ================================================================
    // ====== MAP GENERATION ==========================================
    // ================================================================

	fixLayer(layer, map){
		layer.layer.hexSideLength = map.hexSideLength;
		layer.layer.wdith = map.wdith;
		layer.layer.height = map.height;
		for (const t of layer.getTilesWithin()) {
			t.updatePixelXY();
		}
	}

	createRandomMap(map, layer) {
        mapData = [];
        const noise = new Noise(seed);
        for (var y = 0; y < 160; y++) {
            for (var x = 0; x < 240; x++) {
				let d = this.getBiome(x, y, noise)
                mapData.push(
                    {
                        id: (x+"-"+y),
                        biome: d,
                        features: [],
                        x: x,
                        y: y
                    }
                )
				//console.log(`x:${x}  y:${y}`)
				map.putTileAt(d, x, y, true, layer);
            }
        }
        console.log(mapData);
    }

	getBiome(x, y, noise) {
        let zoom = 50;
        let v = this.getOctaves(x, y, zoom, 1, 3, noise)

        let deepoceanlevel = 0.47;
        let oceanlevel = 0.55;
        let grasslevel = 0.6;

        if (v < deepoceanlevel){
            return 3//"deepocean"
        } else if (v >= deepoceanlevel && v < oceanlevel){
            return 4//"ocean"
        } else if (v >= oceanlevel && v <= grasslevel){
            return 5//"shore"
        } else if (v > grasslevel){
            return 1//"grassland"
        } else{
            console.log("tile failed to load. if this message appears, something went wrong with the map generation.")
            return "black"
        }
    }

    getOctaves(x, y, zoom, baseFalloff, count, noise) {
        let octaves = []
        let falloff = baseFalloff;

        for(let i = 1; i <= count; i++){
            let v = noise.perlin2(x / (zoom/(i*i)), y /  (zoom/(i*i)));
            v = ((v - 0.5) + 1) / 2
            v = v * falloff;

            octaves.push(v);
            falloff *= 0.5;
        }

        let v = 0;
        octaves.forEach(octave => {
            v += octave
        });
        
        return v;
    }

    // ================================================================
    // ====== UPDATE BLOCKS ===========================================
    // ================================================================

	updateCamera() {
		if (!cursorIsOnCanvas) return;
		const pointer = this.input.activePointer;

		if (pointer.y > camera.height - 100) return;

		camera.zoom = camZoom;


		const cameraSpeed = cameraSpanSpeed - camZoom;
		const edgeThreshold = 100;
		// Check if the mouse is near the edges
		const nearTop = pointer.y < (edgeThreshold + 25) && pointer.y > 25;
		const nearBottom = pointer.y > camera.height - (edgeThreshold + 100) && pointer.y < camera.height - 100;
		const nearLeft = pointer.x < edgeThreshold;
		const nearRight = pointer.x > camera.width - edgeThreshold;

        let scrollX = camera.scrollX;
        let scrollY = camera.scrollY;
		// Adjust the camera position based on the mouse position and edges
		if (nearTop) {
			scrollY -= cameraSpeed;
		}
		if (nearBottom) {
			scrollY += cameraSpeed;
		}
		if (nearLeft) {
			scrollX -= cameraSpeed;
		}
		if (nearRight) {
			scrollX += cameraSpeed;
		}


        camera.setScroll(scrollX, scrollY);
		//camera.setScroll(scrollX, scrollY);
	}


}