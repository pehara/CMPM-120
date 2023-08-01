class CreditsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CreditsScene' });
    }

    create() {
        this.sound.play('setsukobgm', { loop: true });

        // Display the credits text with styles
        const titleStyle = {
            fontFamily: 'Poppins',
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#ffffff',
            align: 'center',
        };

        const textStyle = {
            fontFamily: 'Poppins',
            fontSize: '24px',
            color: '#ffffff',
            align: 'center',
        };

        // Position of the credits text on the screen
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        // Define the vertical spacing between credit lines
        const lineSpacing = 30;

        // Create a group for the credits
        this.creditsGroup = this.add.group();

        // Display the credits text
        this.creditsGroup.add(this.add.text(centerX, centerY - 150, 'CREDITS', titleStyle).setOrigin(0.5));
        this.creditsGroup.add(this.add.text(centerX, centerY - 100, 'Adapted from Grave of the Fireflies', textStyle).setOrigin(0.5));
        this.creditsGroup.add(this.add.text(centerX, centerY - 50, 'Game developed by:', titleStyle).setOrigin(0.5));
        this.creditsGroup.add(this.add.text(centerX, centerY, 'Pehara', textStyle).setOrigin(0.5));
        this.creditsGroup.add(this.add.text(centerX, centerY + 50, 'Art made by:', titleStyle).setOrigin(0.5));
        this.creditsGroup.add(this.add.text(centerX, centerY + 100, 'Pehara', textStyle).setOrigin(0.5));
        this.creditsGroup.add(this.add.text(centerX, centerY + 150, 'Sounds:', titleStyle).setOrigin(0.5));

        const creditLines = [
            'air raid siren: Sound Effect from Pixabay',
            'war ambience: Sound Effect by imagne_impossible from Pixabay',
            'running: Sound Effect from Pixabay',
            'fire: Sound Effect by IMGMIDI from Pixabay',
            'click: Sound Effect by u_2fbuaev0zn from Pixabay',
            'alert farmer: Sound Effect by UNIVERSFIELD from Pixabay',
            'gather scene ambience: Sound Effect by Alban_Gogh from Pixabay',
            'setsuko: Music by WELC0MEИ0 from Pixabay',
        ];

        let yPosition = centerY + 200;

        // Display each credit line with proper spacing
        for (const line of creditLines) {
            this.creditsGroup.add(this.add.text(centerX, yPosition, line, textStyle).setOrigin(0.5));
            yPosition += lineSpacing;
        }
        
        // Set up scroll effect for the credits text
        this.creditsSpeed = 0.3; // Adjust the scrolling speed
        this.isScrolling = true;
        this.finishedScrolling = false;

        // Create the 'Back' button to return to the MenuScene
        this.backButton = this.add.text(centerX, this.cameras.main.height - 50, 'Back to Main Menu', textStyle).setOrigin(0.5);
        this.backButton.setInteractive();
        this.backButton.on('pointerup', () => {
            // Stop the Setsuko music when the credits finish scrolling
            this.sound.stopAll();
            this.scene.start('MenuScene');
        });

        this.backButton.on('pointerover', () => {
            this.backButton.setStyle({ color: '#ff0000' }); // Change color when the pointer is over the button
        });

        this.backButton.on('pointerout', () => {
            this.backButton.setStyle({ color: '#ffffff' }); // Reset color when the pointer is out of the button
        });
    }

    update() {
        // Scroll the credits text upwards if they are still scrolling
        if (this.isScrolling) {
            this.creditsGroup.getChildren().forEach((credit) => {
                credit.y -= this.creditsSpeed;
            });

            // If the last credit line goes off the top of the screen, stop scrolling
            if (this.creditsGroup.getChildren()[this.creditsGroup.getChildren().length - 1].y < -this.creditsSpeed) {
                this.isScrolling = false;
                this.finishedScrolling = true;
            }
        } else if (this.finishedScrolling) {
            // If the credits have finished scrolling, display the 'Back' button
            this.backButton.setVisible(true);
        }
    }
}
