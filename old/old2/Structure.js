
class Structure extends Phaser.GameObjects.Image {
    constructor(scene, id, xPos, yPos, structureName) {
        
        var image = "structure_" + structureName;

        super(scene, xPos, yPos, image)

        this.id = id;
        this.xPos = xPos;
        this.yPos = yPos;
        this. structureName = structureName;

        console.log(this.getStructureData());

        scene.add.existing(this);

        this.setInteractive({
            cursor: 'url(assets/ui/cursor_select.png), pointer'
        });
    }


    getStructureData(){
        return cityData.find(structure => structure.name === this.structureName)
    }
}

