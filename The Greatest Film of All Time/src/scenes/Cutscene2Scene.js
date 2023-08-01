class Cutscene2Scene extends Phaser.Scene {
	constructor() {
		super({ key: 'Cutscene2Scene' });
		this.currentImageIndex = 0;
		this.images = ['image4', 'image5', 'image6'];
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
		// Transition to the next scene
		this.sound.play('select', { volume: 0.5 });
		this.scene.start('GatherScene');
	}
}
  