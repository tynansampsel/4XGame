const CityFunctions = {
    //this is called after every turn.
    endOfTurnUpdate(cityId){
        //let cityId = 
        let thisCity = this.getCityData(cityId)


        this.updateProduction(cityId);

        // //this checks for a current work
        if(thisCity.currentWork.name != "") {
            this.doConstruction(cityId);
        }

        this.updateProduction(cityId);
        //
        this.doPopulationGrowth(cityId);
        
        console.log(thisCity);
    },

    doConstruction(cityId){
        let thisCity = this.getCityData(cityId)

        var currentWorkData = getBuildingData(thisCity.currentWork.name)
        var currentWork = thisCity.currentWork

        currentWork.production += thisCity.production;

        
        if(currentWork.production >= currentWorkData.productionCost){
            console.log(thisCity.name+" has built a "+ thisCity.currentWork.name);
            thisCity.buildings.push(currentWork.name)
            thisCity.currentWork.name = "";
            thisCity.currentWork.production = 0;
        }
    },

    updateProduction(cityId){
        let thisCity = this.getCityData(cityId)


        if(thisCity.buildings.length > 0){
            console.log("p")

            thisCity.production = 2 + thisCity.buildings.reduce((acc, buildingName) => {
                return acc + getBuildingData(buildingName).production
            },0);
        } else {
            console.log("e")
            thisCity.production = 2
        }

        if(thisCity.buildings.length > 0){
            thisCity.food = 2 + thisCity.buildings.reduce((acc, buildingName) => {
                return acc + getBuildingData(buildingName).food
            },0);
        } else {
            thisCity.food = 2
        }
    },

    doPopulationGrowth(cityId){
        let thisCity = this.getCityData(cityId)

        // thisCity.foodSpentForPopulation = 5;
        // console.log(thisCity.name+" has "+ cityData[cityId].foodSpentForPopulation+" food");

        thisCity.foodSpentForPopulation += thisCity.food;
        let foodCost = 4+ (thisCity.population * thisCity.population)
        
        if(thisCity.foodSpentForPopulation >= foodCost){
            
            thisCity.population++;
            thisCity.foodSpentForPopulation = 0;
            console.log(thisCity.name+" has grown! pop:"+ thisCity.population);
        }
    },

    getCityData(cityId){
        return cityData[cityId]
        //return cityData.find(city => city.id === cityId)
    }
}