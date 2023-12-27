const S_buildingData = [
    {
        name: "smithery",
        productionCost: 20,
        production: 2,
        food: 0
    },
    {
        name: "grainery",
        productionCost: 20,
        production: 0,
        food: 2
    }
]
function getBuildingData(nameOfBuilding){
    return S_buildingData.find(building => building.name === nameOfBuilding)
}