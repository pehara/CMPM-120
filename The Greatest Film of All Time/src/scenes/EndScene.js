class EndScene extends Phaser.Scene {
    constructor() {
        super({ key: 'EndScene' });
    }

    create() {
        // Display the end image
        this.add.image(0, 0, 'endImage').setOrigin(0);

        // Add a "Credits" button
        const buttonX = this.cameras.main.width / 2;
        const buttonY = this.cameras.main.height - 50;
        const creditsButton = this.add.text(buttonX, buttonY, 'Credits', {
            fontSize: '24px',
            fill: '#ffffff',
            backgroundColor: '#000000',
            padding: {
                x: 10,
                y: 5
            }
        }).setOrigin(0.5).setInteractive();

        // Handle the "Credits" button click event
        creditsButton.on('pointerup', () => {
            this.scene.start('CreditsScene');
        });
    }
}
