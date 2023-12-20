let tilemapArr = {};
let camera = null;
let camZoom = 1;
let cameraSpanSpeed = 1;
let cursorIsOnCanvas = true;
let scrollY = 0;
let scrollX = 0;
let seed = 11;

class HexTileMap extends Phaser.Scene {
	constructor() {
		super({ key: "HexTileMap" })
	}

	preload() {
		this.load.image('tileset_world_base', 'assets/tilesets/tileset_world_base.png');
		this.load.image('tileset_world_structure', 'assets/tilesets/tileset_world_structure.png');
		this.load.tilemapTiledJSON('hexMap', 'json/tilemap.json');
	}

	create() {
		camera = this.cameras.main;
		camera.setSize(800, 600);
		camera.zoom = 1;
		let canvas = this.sys.game.canvas;

		const map = this.add.tilemap('hexMap');
		const tileset_world_base = map.addTilesetImage('tileset_world_base', 'tileset_world_base');
		const tileset_world_structure = map.addTilesetImage('tileset_world_structure', 'tileset_world_structure');
		//map.createLayer('tileMap2', tileset);
		const layer_world_base = map.createBlankLayer('world_base', tileset_world_base, 0, 0, 240, 160, 64, 65);
		const layer_world_structure = map.createBlankLayer('world_structure', tileset_world_base, 0, 0, 240, 160, 64, 65);
		

		this.fixLayer(layer_world_base, map);
		this.fixLayer(layer_world_structure, map);

		layer_world_base.fill(1, 0, 0, 240, 160)
		layer_world_structure.fill(0, 0, 0, 240, 160)

		this.createRandomMap( map, layer_world_base)
		//this.createRandomMap(map)
		//camera.setBounds(-50, -50, map.widthInPixels+50, map.heightInPixels+50);
		//camera.setZoom(1);
		//camera.setScroll(0, 0);
		layer_world_base.setCullPadding(60, 40);
		layer_world_structure.setCullPadding(60, 40);

		// Set up the pointerdown event
		// this.input.on('pointerup', function (pointer) {
		//     var tile = map.getTileAtWorldXY(pointer.worldX, pointer.worldY);

		//     console.log(pointer.worldX, pointer.worldY, tile);
		// }, this);
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


		canvas.addEventListener('mouseenter', function () {
			//cursorIsOnCanvas = true;
			console.log("in")
		});

		canvas.addEventListener('mouseleave', function () {
			//cursorIsOnCanvas = false;
			console.log("out")
		});

		this.input.on('wheel', event => {
			camZoom += -((event.deltaY / 1000));
			camZoom = Phaser.Math.Clamp(camZoom, 0.2, 1.5);
		});


		this.input.on('pointerup', function (pointer) {
			// Calculate the tile coordinates based on the pointer's world position
			console.log('World Coordinates:', pointer.worldX, pointer.worldY);

			const tile = map.worldToTileXY(pointer.worldX, pointer.worldY);
			console.log(tile);
			console.log(tile.x, tile.y);

			// Put a tile at the calculated coordinates (assuming tileId is the tile you want to place)
			map.putTileAt(7, tile.x, tile.y, false, layer_world_structure);

			//layer_world_base.putTileAt(3, 0, 0);
		}, this);
	}

	fixLayer(layer, map){
		layer.layer.hexSideLength = map.hexSideLength;
		layer.layer.wdith = map.wdith;
		layer.layer.height = map.height;
		for (const t of layer.getTilesWithin()) {
			t.updatePixelXY();
		}
	}

	update() {
		this.updateCamera()
	}

	updateCamera() {
		if (!cursorIsOnCanvas) return;
		const pointer = this.input.activePointer;

		if (pointer.y > camera.height - 100) return;

		camera.zoom = camZoom;


		const cameraSpeed = 6 - camZoom;
		const edgeThreshold = 100;
		// Check if the mouse is near the edges
		const nearTop = pointer.y < (edgeThreshold + 25) && pointer.y > 25;
		const nearBottom = pointer.y > camera.height - (edgeThreshold + 100) && pointer.y < camera.height - 100;
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

		//camera.setScroll(scrollX, scrollY);
	}

	createRandomMap(map, layer) {
        mapData = [];
        const noise = new Noise(seed);
        for (var y = 0; y < 160; y++) {
            for (var x = 0; x < 240; x++) {

				let d = this.getBiome(x, y, noise)
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
}