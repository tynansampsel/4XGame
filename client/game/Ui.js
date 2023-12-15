
var turnText;
var dateText;
var cityUiBoxName;

var cityInfoCurrentFoodProduction;
var cityInfoCurrentWorkProduction;
var cityInfoPopulation;

var selectedCity = -1;

class Ui extends Phaser.Scene {
    constructor() {
        super({key: "Ui", active: true})
    }

    preload() {
        //this.load.image('hex_grassland', 'assets/tiles/hex_grassland_small.png');
        //this.load.image('hex_desert', 'assets/tiles/hex_desert_small.png');
        //this.load.image('hex_ocean', 'assets/tiles/hex_ocean_small.png');
        //this.load.image('test_tile', 'assets/tiles/test_tile.png');

        // this.load.image('structure_city', 'assets/tiles/structure_city_small.png');
        // this.load.image('structure_mine', 'assets/tiles/structure_mine_small.png');
        // this.load.image('structure_farm', 'assets/tiles/structure_farm_small.png');
        
        this.load.image('ui_tool', 'assets/tiles/ui_tool.png');
        this.load.image('ui_bottom_bar', 'assets/ui/ui_bottom_bar.png');
        this.load.image('ui_top_bar', 'assets/ui/ui_top_bar.png');
        this.load.image('button_arrow', 'assets/ui/button_arrow.png');

        this.load.image('icon_settlers', 'assets/ui/icon_settlers.png');
        this.load.image('icon_farm', 'assets/ui/icon_farm.png');
        this.load.image('icon_mine', 'assets/ui/icon_mine.png');

        // this.load.image('cursor_default', 'assets/ui/cursor_default.png');

        // this.load.image('city_range_1', 'assets/tiles/city_range_1.png');
        // this.load.image('hex_highlight', 'assets/ui/hexhighlight.png');

    }

    create() {
        this.add.image(400, 551,"ui_bottom_bar");
        this.add.image(400, 10,"ui_top_bar");

        this.input.keyboard.on('keydown-E', event => {
            if(cursorMode != "brush") return
            console.log("E");
            brush++;
            if (brush > 2) brush = 0;
        });

        this.input.keyboard.on('keydown-Q', event => {
            if(cursorMode != "brush") return
            console.log("switched mode");
            mapMode = !mapMode;
        });

        turnText = this.add.text(10, 450, 'Turn: '+gameData.currentTurn, { fontSize: '16px', fill: '#FFF', strokeThickness: 0.5, align: "right" });
        dateText = this.add.text(10, 475, getDate()+', '+getYear()+'AD', { fontSize: '16px', fill: '#FFF', strokeThickness: 0.5, align: "right" });
        
        
        
        console.log("f")
        
        cityUiBoxName = this.add.text(185, 515, this.getCityName(), { fontSize: '16px', fill: '#000', strokeThickness: 0.5, align: "right" });

        cityInfoCurrentFoodProduction = this.add.text(450, 515, this.getCityDataNoId().food, { fontSize: '16px', fill: '#03C03C',stroke: '#000000', strokeThickness: 0.5, align: "left" });
        cityInfoCurrentWorkProduction = this.add.text(450, 525, this.getCityDataNoId().production, { fontSize: '16px', fill: '#E97451',stroke: '#000000', strokeThickness: 0.5, align: "left" });
        cityInfoPopulation = this.add.text(450, 535, this.getCityDataNoId().population, { fontSize: '16px', fill: '#03C03C',stroke: '#000000', strokeThickness: 0.5, align: "left" });


        brushObject = this.add.image(85, 551,"hex_grassland");
        var nextTurnButton = this.add.image(700, 551,"button_arrow").setInteractive();
        nextTurnButton.on('pointerdown', () => {
            gameData.playersFinished[0] = true;
            gameData.playersFinished[1] = true;
            this.endTurn();
        })

        var smitheryBuildingButton = this.add.image(200, 575,"icon_mine").setInteractive();
        smitheryBuildingButton.on('pointerdown', () => {
            this.setCityConstruction(0);
        })
        
        var graineryBuildingButton = this.add.image(250, 575,"icon_farm").setInteractive();
        graineryBuildingButton.on('pointerdown', () => {
            this.setCityConstruction(1);

        })

        var farmStructureButton = this.add.image(300, 575,"icon_farm").setInteractive();
        farmStructureButton.on('pointerdown', () => {
            if(cursorMode != "none") return
            cursorMode = "build"
            buildModeStructure = "farm"
        })


    }

    update() {
        cityUiBoxName.setText(this.getCityName());
        cityInfoCurrentFoodProduction.setText("Food: "+this.getCityDataNoId().food);
        cityInfoCurrentWorkProduction.setText("Work: "+this.getCityDataNoId().production);
        cityInfoPopulation.setText("Pop: "+this.getCityDataNoId().population);

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

    getCityName(){
        if(selectedCity < 0){
            return "none"
        } else {
            return this.getCityData(selectedCity).name
        }
    }

    getCityData(id){
        return cityData.find(city => city.id === id)
    }

    
    getCityDataNoId(){
        if(selectedCity < 0){
            return "none"
        } else {
            return this.getCityData(selectedCity)
        }
    }


    setCityConstruction(structureId){
        this.getCityData(selectedCity).currentWork = {
            name : S_buildingData[structureId].name,
            production : 0
        }
    }

    endTurn(){
        event_nextTurn = true;
        turnText.setText('Turn: '+gameData.currentTurn);
        dateText.setText(getDate()+', '+getYear()+'AD');
    }
}