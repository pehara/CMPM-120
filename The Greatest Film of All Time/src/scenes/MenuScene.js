class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {
        // Load the 'select' sound
        this.load.audio('select', './assets/select.mp3');
    }

    create() {
        // Set up the background image
        this.add.image(0, 0, 'bgmenu').setOrigin(0, 0);

        // Make the start button interactive
        const startButton = this.add.image(this.cameras.main.centerX + 170, this.cameras.main.height - 385, 'startbutton').setInteractive();
        startButton.setScale(1); // Reduce the size of the button (optional)

        // Event triggers on a mouse click
        startButton.on('pointerup', () => this.startGame());

        // Add the credits button in the bottom right corner
        const creditsButton = this.add.text(this.cameras.main.width - 30, this.cameras.main.height - 30, 'Credits', {
            fontFamily: 'Poppins',
            fontSize: '20px',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 },
        }).setOrigin(1).setInteractive();

        // Event triggers on a mouse click
        creditsButton.on('pointerup', () => this.showCredits());

        // Ensure the credits button is above other elements
        creditsButton.setDepth(1);
    }

    startGame() {
        // Play the 'select' sound once
        this.sound.play('select', { volume: 0.5 });

        // Transition to the next scene after a short delay (optional)
        this.time.delayedCall(100, () => {
            this.scene.start('CutsceneScene');
        });
    }

    showCredits() {
        // Play the 'select' sound once
        this.sound.play('select', { volume: 0.5 });

        // Transition to the CreditsScene
        this.scene.start('CreditsScene');
    }
}
