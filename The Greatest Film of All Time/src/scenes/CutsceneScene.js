class CutsceneScene extends Phaser.Scene {
	constructor() {
		super({ key: 'CutsceneScene' });
		this.currentImageIndex = 0;
		this.images = ['image1', 'image2', 'image3'];
	}

	preload() {
		// Load the 'select' sound
		this.load.audio('select', './assets/select.mp3');
	}

	create() {
		// Reset the currentImageIndex to 0 when the scene is created or restarted
        this.currentImageIndex = 0;
		
		this.currentImage = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, this.images[this.currentImageIndex]);
	
		// Add the Next button
		this.nextButton = this.add.image(this.cameras.main.width - 165, this.cameras.main.height - 65, 'nextButton').setInteractive();
		this.nextButton.on('pointerup', () => this.showNextImage());
	
		// Add the Continue button
		this.continueButton = this.add.image(this.cameras.main.width - 165, this.cameras.main.height - 65, 'continueButton').setInteractive();
		this.continueButton.on('pointerup', () => this.continueToNextScene());
	
		this.nextButton.visible = true;
		this.continueButton.visible = false; // Hide the Continue button initially
	}

	showNextImage() {
		// Play the 'select' sound when the next button is clicked
		this.sound.play('select', { volume: 0.5 });

		this.currentImageIndex++;
		if (this.currentImageIndex < this.images.length) {
			this.currentImage.setTexture(this.images[this.currentImageIndex]);
		} else {
			this.nextButton.visible = false;
			this.continueButton.visible = true; // Show the Continue button when all images are shown
		}
	}

	continueToNextScene() {
		// Play the 'select' sound when the continue button is clicked
		this.sound.play('select', { volume: 0.5 });

		// Transition to the next scene after a short delay (optional)
		this.time.delayedCall(100, () => {
			this.scene.start('BombScene');
		});
	}
}
