let S_improvementData = [
    {
        name: "farm",
        available: ["grassland"],
        productionCost: 20,
        production: 0,
        food: 2
    },
    {
        name: "mine",
        available: ["grassland", "desert"],
        productionCost: 20,
        production: 2,
        food: 0
    }
]
function getImprovementData(nameOfImprovement){
    return S_improvementData.find(improvement => improvement.name === nameOfImprovement)
}