class Title extends Phaser.Scene {
    constructor() {
        super("titleScene");
    }

    preload() {
        // Load menu sounds
        this.load.audio('bgmusic', './assets/bgmusic.wav');
        this.load.image('bgmenu', './assets/bgmenu.png');
    }

    create() {
        // Menu config
        this.add.image(0, 0, 'bgmenu').setOrigin(0, 0);

        // set up cursor keys
        const cursors = this.input.keyboard.createCursorKeys(); // Declare cursors as a local variable

        // Assign cursors to the class instance
        this.cursors = cursors;
    }

    update() {
        // check for UP input
        if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
			// Play the meow sound
			this.sound.play('meow');

            // start next scene
            this.scene.start('playScene');
        }
    }
}

