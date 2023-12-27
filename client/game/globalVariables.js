let cameraVariables = {
    camera: null,
    camZoom: 1,
    cameraSpanSpeed: 75,
    cursorIsOnCanvas: true,
    scrollY: 0,
    scrollX: 0
}

let cursorVariables = {
    currentSelectedTile: "0-0",
    currentSelectedCity: "-1",
    currentHoveringTile: "0-0",
    selectedTileHighlight: null,
    cursorMode: "none"
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