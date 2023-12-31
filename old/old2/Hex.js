//const Phaser = require("phaser");

class Hex extends Phaser.GameObjects.Image {
    constructor(scene, id, xPos, yPos) {
        
        var image = "hex_"+ mapData.find(hex => hex.id === id).biome;

        super(scene, xPos, yPos, image)

        this.id = id;
        this.xPos = xPos
        this.yPos = yPos
        //console.log("boop");

        scene.add.existing(this);
        scene.hexes.add(this);

        this.setInteractive();

        this.on('pointerover', function (pointer) {
            selectedTile = this.getHexData().id;
            scene.moveSelectedTilehighlight(this.xPos, this.yPos);
        });

        this.on('pointerdown', () => {
            //console.log("clicked: " + x + "-" +y)

            selectedTile = this.getHexData().id;
            
            if(cursorMode === "brush") {
                selectedTile = this.getHexData().id;
                scene.moveSelectedTilehighlight(this.xPos, this.yPos);
                
                switch (brush) {
                    case 0:
                        this.getHexData().biome = "grassland";
                        break;
                    case 1:
                        this.getHexData().biome = "desert";
                        break;
                    case 2:
                        this.getHexData().biome = "ocean";
                        break;
                }
            } else if(cursorMode === "buildcity") {
                if(buildModeStructure != "city") return
                let cityId = cityData.length;
                cityData.push({
                    id: cityId,
                    name: "nill",
                    hex: this.getHexData().id,
                    owner: 1,
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
                console.log("pos: " + this.xPos + "-" +this.yPos)
    
                var newCity = new City(this.scene, cityId, this.xPos, this.yPos);

            } else if(cursorMode === "build") {
                if(buildModeStructure == "farm"){
                    console.log("buildFarm")
                    cursorMode = "none";

                    // let cityId = cityData.length;
                    // cityData.push({
                    //     id: cityId,
                    //     name: "nill",
                    //     hex: this.getHexData().id,
                    //     owner: 1,
                    //     buildings: [],
                    //     production: 2,
                    //     food: 0,
                    //     population: 1,
                    //     foodSpentForPopulation: 0,
                    //     currentWork: {
                    //         name: "smithery",
                    //         production: 0
                    //     }
                    // })
                console.log("pos: " + this.xPos + "-" +this.yPos)
    
                var newFarm = new Structure(this.scene, 0, this.xPos, this.yPos, "farm");
                }
            }
            /*
            this.getHexData().features.push({
                id: this.getHexData().features.length,
                feature: "City",
                owner: "1"
            });*/
            this.updateVisuals()
        })
    }

    getHexData(){
        return mapData.find(hex => hex.id === this.id)
    }

    getCityData(hexId){
        return cityData.find(city => city.id === hexId)
    }

    updateVisuals(){
        this.setTexture('hex_' + this.getHexData().biome)

        //this.getHexData().features
    }

    updateTileData(){
        console.log(this.id);
        console.log(mapData.find(hex => hex.id === this.id).biome);
        //console.log(mapData.find(hex => hex.id === this.id).biome);
        mapData.find(hex => hex.id === this.id).biome = this.biome;
    }
}