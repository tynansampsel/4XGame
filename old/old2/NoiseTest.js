

class NoiseTest extends Phaser.Scene {
    constructor() {
        super("NoiseTest")
    }

    preload() {
        this.load.script('noise', './noise.js');

        this.load.image('noise_white', 'assets/tiles/noise_white_large.png');
    }

    create() {
        //this.add.image(50, 50,"noise_white");
        this.createRandomMap();
    }

    createRandomMap() {
        mapData = [];
        const noise = new Noise();

        for (var y = 0; y < 20; y++) {
            for (var x = 0; x < 20; x++) {
                //let t = bobbletop
                let xPos = x*20
                let yPos = y*20
                
                const zoom = 50
                let v = noise.perlin2(x/zoom, y/zoom);
                v = (v + 1) / 2;
                console.log(v)

                //let v = perlin.noise2D(x+0.5, y+0.5);
                if(v > 1){

                    console.log(v)
                }
                this.add.image(xPos, yPos,"noise_white");
                this.add.text(xPos, yPos+2, v, { fontSize: '6px', fill: '#000',align: "center" });

            }
        }
    
        console.log(mapData);

        
    }

    
}

