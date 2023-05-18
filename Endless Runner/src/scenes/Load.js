class Load extends Phaser.Scene {
    constructor(){
        super('loadScene');
    }

    preload() {
		// Load sounds
		this.load.audio('bgmusic', './assets/bgmusic.wav');
        this.load.audio('meow', './assets/meow.wav');
        this.load.audio('jump', './assets/jump.wav');

        // Load images
		this.load.image('bgmenu', './assets/bgmenu.png');
        this.load.image('sky', './assets/sky.png');
        this.load.image('clouds', './assets/clouds.png');
        //this.load.image('player', './assets/player.png');
        this.load.image('ground', './assets/ground.png');
        this.load.image('sunlight', './assets/sunlight.png');
        this.load.image('obstacle', './assets/obstacle.png');
        this.load.image('gameover', './assets/gameover.png');
        this.load.image('flyingobstacle', './assets/flyingobstacle.png');
        this.load.image('trees', './assets/trees.png');
        this.load.image('cloudsback', './assets/cloudsback.png');
        this.load.image('player', './assets/player.png');
       
        // Load animations
        //this.load.spritesheet("player", "player.png", { frameWidth: 57, frameHeight: 87 });
        //this.load.spritesheet('player', './assets/player.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
	}

    create() {
        // Check for the local browser support
        if(window.localStorage) {
            console.log('local storage supported');
        } else {
            console.log('local storage not supported');
        }

        // go to the title scene
        this.scene.start('titleScene');
    }
}