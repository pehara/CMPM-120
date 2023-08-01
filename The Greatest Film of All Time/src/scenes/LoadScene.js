class LoadScene extends Phaser.Scene {
    constructor(){
        super('LoadScene');
    }

    preload() {
        // Load sounds
        this.load.audio('bombairraidbgm', './assets/airraid.mp3');
        this.load.audio('caught', './assets/caughtbyfarmer.mp3');
        this.load.audio('bombefirebgm', './assets/fireambience.mp3');
        this.load.audio('gatherbgm', './assets/gatherambience.mp3');
        this.load.audio('runningchar', './assets/runningsound.mp3');
        this.load.audio('select', './assets/select.mp3');
        this.load.audio('bombbgm', './assets/warambience.mp3');
        this.load.audio('setsukobgm', './assets/setsuko.mp3');

        // Load for the Menu
        this.load.image('bgmenu', './assets/bgmenu.png');
        this.load.image('startbutton', './assets/startbutton.png');

        // Load for first cutscene
        this.load.image('continueButton', './assets/continuebutton.png');
        this.load.image('nextButton', './assets/nextbutton.png');

        this.load.image('image1', './assets/image1.png');
		this.load.image('image2', './assets/image2.png');
		this.load.image('image3', './assets/image3.png');

        // Gameover scene
        this.load.image('gameOverBackground', './assets/gameover.png');
        this.load.image('restartbutton', './assets/restartbutton.png');
    
        // Load for the Bomb Scene
        this.load.image('tiles', './assets/scene1assets.png');
        this.load.tilemapTiledJSON('map', './assets/Scene1AssetsTileMap.json');
        this.load.image('bombexit', './assets/bombexit.png');

        this.load.image('bomb', './assets/bomb.png');
        this.load.image('fire', './assets/fire.png');
        this.load.image('explosion', './assets/explosion.png');

        // Preload player spritesheet
        this.load.spritesheet('player', './assets/playerchar.png', {
            frameWidth: 65,
            frameHeight: 83
        });

        // Load for cutscene 2
		this.load.image('continueButton', './assets/continueButton.png');
		this.load.image('nextButton', './assets/nextButton.png');

		// Load for cutscene
		this.load.image('image4', './assets/image4.png');
		this.load.image('image5', './assets/image5.png');
		this.load.image('image6', './assets/image6.png'); 

        // Gather scene preload
		this.load.image('tiles', './assets/scene1assets.png');
		this.load.tilemapTiledJSON('map', './assets/Scene1AssetsTileMap.json');
		
		this.load.image('food', './assets/tempfood.png');
		this.load.image('toy', './assets/temptoy.png');
		//this.load.image('player', './assets/tempplayer.png');
		this.load.image('homeexit', './assets/homeexit.png');

		this.load.spritesheet('farmer', './assets/farmer.png', {
            frameWidth: 65,
            frameHeight: 83
        });

        this.load.spritesheet('player', './assets/playerchar.png', {
            frameWidth: 65,
            frameHeight: 83
        });

        // Feed Setsuko
        this.load.image('food', './assets/tempfood.png');
        this.load.image('toy', './assets/temptoy.png');
        this.load.image('background', './assets/homebg.png');

        this.load.spritesheet('setsuko', './assets/setsuko.png', {
            frameWidth: 800,
            frameHeight: 600
        });

        // End scene
        this.load.image('endImage', './assets/endimage.png');

	}

    create() {
        // Check for the local browser support
        if(window.localStorage) {
            console.log('local storage supported');
        } else {
            console.log('local storage not supported');
        }

        // go to the title scene
        this.scene.start('MenuScene');
    }
}