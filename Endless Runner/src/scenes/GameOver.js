class GameOver extends Phaser.Scene {
    constructor() {
        super('gameOverScene');
    }

    create(data) {
        // Load game over image
        this.gameover = this.add.tileSprite(0, 0, 960, 640, 'gameover').setOrigin(0, 0);
        
        const { score } = data; // Get the score from the data object

        // Set up the audio
        this.sadMusic = this.sound.add('sadmusic', {
            mute: false,
            volume: 1,
            rate: 1,
            loop: true
        });

        // Play sad music
        this.sadMusic.play();

        // Display the score on the game over screen
        this.add.text(
            this.sys.game.config.width / 2,
            this.sys.game.config.height / 2,
            `Game Over\nScore: ${score}`,
            { fontSize: '32px', fill: '#ffffff', align: 'center' }
        ).setOrigin(0.5);

        // set up cursor keys
        const cursors = this.input.keyboard.createCursorKeys(); // Declare cursors as a local variable

        // Assign cursors to the class instance
        this.cursors = cursors;
    }

    update() {
        // check for UP input
        if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
            // Play the resetsound
            this.sound.play('restartsound');
            this.sadMusic.stop();
        
            // Start next scene
            //this.scene.start('restartsound');
            this.scene.start('titleScene');
        }
    }
      
}
