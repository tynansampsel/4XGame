//const Phaser = require("phaser");

class Hex extends Phaser.GameObjects.Image {
    constructor(scene, id, x, y, xPos, yPos, biome) {
        
        super(scene, xPos, yPos, "hex_"+biome)

        this.biome = biome;

        console.log("boop");

        scene.add.existing(this);
        scene.hexes.add(this);

        this.setInteractive();

        this.on('pointerdown', () => {
            //console.log("clicked: " + x + "-" +y)

            console.log("clicked: " + mapData.find(hex => hex.id === id).biome)

            switch (brush) {
                case 0:
                    this.setTexture('hex_grassland')
                    this.biome = "grassland";
                    break;
                case 1:
                    this.setTexture('hex_desert')
                    this.biome = "desert";
                    break;
                case 2:
                    this.setTexture('hex_ocean')
                    this.biome = "ocean";
                    break;
            }
            this.updateTileData()
        })
    }


    updateTileData(){
        console.log(mapData.find(hex => hex.id === this.id).biome);
        mapData.find(hex => hex.id === this.id).biome = this.biome;
    }
}