//const Phaser = require("phaser");
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
class City extends Phaser.GameObjects.Image {
    constructor(scene, id, xPos, yPos) {
        
        var image = "structure_city";

        super(scene, xPos, yPos, image)

        this.id = id;
        this.xPos = xPos;
        this.yPos = yPos;

        console.log(this.getCityData());

        scene.add.existing(this);
        scene.cities.add(this);

        this.setInteractive({
            cursor: 'url(assets/ui/cursor_select.png), pointer'
        });
        this.on('pointerover', function (pointer) {
            scene.moveSelectedTilehighlight(this.xPos, this.yPos);
        });


        var r = Math.round(Math.random() * cityNames.length);
        this.getCityData().name = cityNames[r];



        
        this.on('pointerdown', () => {
            if(cursorMode === "none") {
                console.log("clicked: " + this.getCityData().name)
                selectedCity = this.getCityData().id
                console.log(selectedCity)
                scene.moveSelectedTilehighlight(this.xPos, this.yPos);
            }
        })

        var range = scene.add.image(xPos, yPos,"city_range_1");
        scene.add.existing(range);
    }

    //this is called after every turn.
    endOfTurnUpdate(){
        this.updateProduction();

        //this checks for a current work
        if(this.getCityData().currentWork.name != "") 
            this.doConstruction();

        this.doPopulationGrowth();
        
        console.log(this.getCityData());
    }

    doConstruction(){
        var currentWorkData = getBuildingData(this.getCityData().currentWork.name)
        var currentWork = this.getCityData().currentWork

        currentWork.production += this.getCityData().production;

        
        if(currentWork.production >= currentWorkData.productionCost){
            console.log(this.getCityData().name+" has built a "+ this.getCityData().currentWork.name);
            this.getCityData().buildings.push(currentWork.name)
            this.getCityData().currentWork.name = "";
            this.getCityData().currentWork.production = 0;


        }

    }

    updateProduction(){
        if(this.getCityData().buildings.length > 0){
            console.log("p")

            this.getCityData().production = 2 + this.getCityData().buildings.reduce((acc, buildingName) => {
                return acc + getBuildingData(buildingName).production
            },0);
        } else {
            console.log("e")
            this.getCityData().production = 2
        }

        if(this.getCityData().buildings.length > 0){
            this.getCityData().food = 2 + this.getCityData().buildings.reduce((acc, buildingName) => {
                return acc + getBuildingData(buildingName).food
            },0);
        } else {
            this.getCityData().food = 2
        }
    }

    doPopulationGrowth(){

        this.getCityData().foodSpentForPopulation += this.getCityData().food;
        var foodCost = 4+(this.getCityData().population * this.getCityData().population)
        
        if(this.getCityData().foodSpentForPopulation >= foodCost){
            
            this.getCityData().population++;
            this.getCityData().foodSpentForPopulation = 0;
            console.log(this.getCityData().name+" has grown! pop:"+ this.getCityData().population);
        }
    }

    getCityData(){
        return cityData.find(city => city.id === this.id)
    }
}

