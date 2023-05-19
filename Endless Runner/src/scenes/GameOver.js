class GameOver extends Phaser.Scene {
    constructor() {
        super('gameOverScene');
    }
  
    create(data) {
        // Load game over image
        this.gameover = this.add.tileSprite(0, 0, 960, 640, 'gameover').setOrigin(0, 0);
    
        const { score, highScore } = data; // Get the score and high score from the data object
    
        // Display the high score on the screen
        // this.add.text(500, 50, `High Score: ${highScore}`, {
        //     fontSize: '32px',
        //     fill: '#ffffff',
        // }).setOrigin(0.5);
    
        // Set up the audio
        this.sadMusic = this.sound.add('sadmusic', {
            mute: false,
            volume: 1,
            rate: 1,
            loop: true
        });
    
        // Play sad music
        //this.sadMusic.play();
    
        // Display the score on the game over screen
        this.add.text(
            this.sys.game.config.width / 2,
            this.sys.game.config.height / 2,
            `Game Over\nScore: ${score}`,
            { fontSize: '32px', fill: '#ffffff', align: 'center' }
        ).setOrigin(0.5);
    
        // Retrieve the high score from local storage
        // const storedHighScore = localStorage.getItem('highScore');
        // if (storedHighScore) {
        //     this.highScore = parseInt(storedHighScore); // Parse the stored value to an integer
        // }
    
        // // check if the current score is higher than the stored high score
        // if (score > this.highScore) {
        //     this.highScore = score;
        //     // Store the new high score in local storage
        //     localStorage.setItem('highScore', this.highScore);
        // }
    
        // // Display the updated high score on the screen
        // this.add.text(500, 50, `High Score: ${this.highScore}`, {
        //     fontSize: '32px',
        //     fill: '#ffffff',
        // }).setOrigin(0.5);
    
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
    
            // Stop the sad music before transitioning
            //this.sadMusic.stop();
    
            // Start the next scene
            this.scene.start('titleScene');
        }
    }
}
  