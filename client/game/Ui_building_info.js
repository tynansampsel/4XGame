let brushUiObject;
brush = 0;
var mapMode = true;

let uiRefs = {
    brushUiObject: null,
    turnText: null,
    dateText: null,
    cityUiBoxName: null,
    cityInfoCurrentFoodProduction: null,
    cityInfoCurrentWorkProduction: null,
    cityInfoPopulation: null,
    nextTurnButton: null,
    smitheryBuildingButton: null,
    graineryBuildingButton: null,
    farmStructureButton: null,
}

let panels = {
    cityInfo: null
}

//var cursorMode = "none";
//none - this means the player can select a new mode
//build - this means the player will build a structure on the next selected tile if possible
//move - not implemented yet, but will be for moving units
//brush - this means the player can alter the terrain.

// var turnText;
// var dateText;
// var cityUiBoxName;

// var cityInfoCurrentFoodProduction;
// var cityInfoCurrentWorkProduction;
// var cityInfoPopulation;

class Ui extends Phaser.Scene {
    constructor() {
        super({key: "Ui", active: true})
    }

    preload() {
        this.load.image('ui_tool', 'assets/tiles/ui_tool.png');
        this.load.image('ui_bottom_bar', 'assets/ui/ui_bottom_bar.png');
        this.load.image('ui_top_bar', 'assets/ui/ui_top_bar.png');
        this.load.image('button_arrow', 'assets/ui/button_arrow.png');

        this.load.image('icon_settlers', 'assets/ui/icon_settlers.png');
        this.load.image('icon_farm', 'assets/ui/icon_farm.png');
        this.load.image('icon_mine', 'assets/ui/icon_mine.png');

        this.load.image('cursor_default', 'assets/ui/cursor_default.png');
    }

    create() {
        this.add.image(400, 551,"ui_bottom_bar");
        this.add.image(400, 10,"ui_top_bar");

        this.input.keyboard.on('keydown-E', event => {
            if(cursorVariables.cursorMode != "brush") return
            console.log("E");
            brush++;
            if (brush > 2) brush = 0;
        });

        this.input.keyboard.on('keydown-Q', event => {
            if(cursorVariables.cursorMode != "brush") return
            console.log("switched mode");
            mapMode = !mapMode;
        });

        uiRefs.turnText = this.add.text(10, 450, 'Turn: '+gameData.currentTurn, { fontSize: '16px', fill: '#FFF', strokeThickness: 0.5, align: "right" });
        uiRefs.dateText = this.add.text(10, 475, getDate()+', '+getYear()+'AD', { fontSize: '16px', fill: '#FFF', strokeThickness: 0.5, align: "right" });
        
        
        uiRefs.cityUiBoxName = this.add.text(185, 515, this.getCityName(), { fontSize: '16px', fill: '#000', strokeThickness: 0.5, align: "right" });

        uiRefs.cityInfoCurrentFoodProduction = this.add.text(450, 515, this.getCityDataNoId().food, { fontSize: '16px', fill: '#03C03C',stroke: '#000000', strokeThickness: 0.5, align: "left" });
        uiRefs.cityInfoCurrentWorkProduction = this.add.text(450, 525, this.getCityDataNoId().production, { fontSize: '16px', fill: '#E97451',stroke: '#000000', strokeThickness: 0.5, align: "left" });
        uiRefs.cityInfoPopulation = this.add.text(450, 535, this.getCityDataNoId().population, { fontSize: '16px', fill: '#03C03C',stroke: '#000000', strokeThickness: 0.5, align: "left" });


        uiRefs.brushUiObject = this.add.image(85, 551,"hex_grassland");

        uiRefs.nextTurnButton = this.add.image(700, 551,"button_arrow").setInteractive();
        uiRefs.nextTurnButton.on('pointerdown', () => {
            gameData.playersFinished[0] = true;
            gameData.playersFinished[1] = true;
            this.endTurn();
        })

        uiRefs.smitheryBuildingButton = this.add.image(200, 575,"icon_mine").setInteractive();
        uiRefs.smitheryBuildingButton.on('pointerdown', () => {
            this.setCityConstruction(0);
        })
        
        uiRefs.graineryBuildingButton = this.add.image(250, 575,"icon_farm").setInteractive();
        uiRefs.graineryBuildingButton.on('pointerdown', () => {
            this.setCityConstruction(1);

        })

        uiRefs.farmStructureButton = this.add.image(300, 575,"icon_farm").setInteractive();
        uiRefs.farmStructureButton.on('pointerdown', () => {
            if(cursorVariables.cursorMode != "none") return
            cursorVariables.cursorMode = "build"
            buildModeStructure = "farm"
        })


    }

    update() {

        if(cursorVariables.currentSelectedCity > 0){
            uiRefs.cityUiBoxName.visible = true;
            uiRefs.cityInfoCurrentFoodProduction.visible = true;
            uiRefs.cityInfoCurrentWorkProduction.visible = true;
            uiRefs.cityInfoPopulation.visible = true;
            uiRefs.nextTurnButton.visible = true;
            uiRefs.smitheryBuildingButton.visible = true;
            uiRefs.graineryBuildingButton.visible = true;
            uiRefs.farmStructureButton.visible = true;

            uiRefs.cityUiBoxName.setText(this.getCityName());
            uiRefs.cityInfoCurrentFoodProduction.setText("Food: "+this.getCityDataNoId().food);
            uiRefs.cityInfoCurrentWorkProduction.setText("Work: "+this.getCityDataNoId().production);
            uiRefs.cityInfoPopulation.setText("Pop: "+this.getCityDataNoId().population);

        } else {
            uiRefs.cityUiBoxName.visible = false;
            uiRefs.cityInfoCurrentFoodProduction.visible = false;
            uiRefs.cityInfoCurrentWorkProduction.visible = false;
            uiRefs.cityInfoPopulation.visible = false;
            uiRefs.nextTurnButton.visible = false;
            uiRefs.smitheryBuildingButton.visible = false;
            uiRefs.graineryBuildingButton.visible = false;
            uiRefs.farmStructureButton.visible = false;
            
        }
        
        if(mapMode){
            switch (brush) {
                case 0:
                    uiRefs.brushUiObject.setTexture('hex_grassland')
                    break;
                case 1:
                    uiRefs.brushUiObject.setTexture('hex_desert')
                    break;
                case 2:
                    uiRefs.brushUiObject.setTexture('hex_ocean')
                    break;
            }
        } else {
            uiRefs.brushUiObject.setTexture('structure_city')
        }
    }

    getCityName(){
        if(cursorVariables.currentSelectedCity < 0){
            return "none"
        } else {
            return this.getCityData(cursorVariables.currentSelectedCity).name
        }
    }

    getCityData(id){
        return cityData.find(city => city.id === id)
    }

    
    getCityDataNoId(){
        if(cursorVariables.currentSelectedCity < 0){
            return "none"
        } else {
            return this.getCityData(cursorVariables.currentSelectedCity)
        }
    }


    setCityConstruction(structureId){
        this.getCityData(cursorVariables.currentSelectedCity).currentWork = {
            name : S_buildingData[structureId].name,
            production : 0
        }
    }

    endTurn(){
        // event_nextTurn = true;
        uiRefs.turnText.setText('Turn: '+gameData.currentTurn);
        uiRefs.dateText.setText(getDate()+', '+getYear()+'AD');


        cityData.forEach((value, index, arr) => {
            CityFunctions.endOfTurnUpdate(index)
        });

    }
}