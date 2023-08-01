class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }
  
    create() {
        this.sound.play('caught', { volume: 0.5 });

        // Add the game over background image
        this.add.image(0, 0, 'gameOverBackground').setOrigin(0);

        // Display "Retry" text button at the bottom right
        const retryText = this.add.text(this.cameras.main.width - 80, this.cameras.main.height - 30, 'Retry', {
            fontSize: '20px',
            fill: '#ffffff',
            backgroundColor: '#000000'
        }).setOrigin(0.5, 0.5).setInteractive();

        // Event triggers on a mouse click or touch
        retryText.on('pointerup', () => this.startGame());
    }
  
    startGame() {
        this.sound.play('select', { volume: 0.5 });
        // Transition to the next scene
        this.scene.start('MenuScene');
    }
}
