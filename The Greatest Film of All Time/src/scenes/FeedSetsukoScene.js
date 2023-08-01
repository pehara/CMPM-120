class FeedSetsukoScene extends Phaser.Scene {
    constructor() {
        super({ key: 'FeedSetsukoScene' });
    }

    create(data) {
        this.sound.play('setsukobgm', { loop: true });
        // Retrieve the inventory data from the scene's data object
        this.inventory = data.inventory;

        // Create background image
        this.add.image(0, 0, 'background').setOrigin(0);

        // Create a button sprite for "Return" at the top left
        const returnButton = this.add.text(20, 20, 'Return', {
            fontSize: '24px',
            fill: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 },
        }).setInteractive();

        // Add a pointerdown event listener to the returnButton
        returnButton.on('pointerdown', () => {
            this.sound.play('select'); // Play the select sound when the button is selected
            this.scene.start('GatherScene');
        });

        // Create Setsuko sprite
        this.setsuko = new Setsuko(this, this.cameras.main.centerX, this.cameras.main.centerY);

        // Create hunger, happiness, and health bars
        const barWidth = 200;
        const barHeight = 20;
        const x = this.cameras.main.width - barWidth - 50; // Upper right corner
        const y = 50;

        // Create text labels for each bar
        const hungerLabel = this.add.text(x - 80, y, 'Hunger', {
            fontSize: '16px',
            fill: '#fff'
        });

        const happinessLabel = this.add.text(x - 80, y + barHeight + 10, 'Happiness', {
            fontSize: '16px',
            fill: '#fff'
        });

        const healthLabel = this.add.text(x - 80, y + 2 * (barHeight + 10), 'Health', {
            fontSize: '16px',
            fill: '#fff'
        });
        
        this.hungerBar = this.add.graphics();
        this.hungerBar.fillStyle(0x00ff00, 1);
        this.hungerBar.fillRect(x, y, (barWidth * this.setsuko.hunger) / 100, barHeight);

        this.happinessBar = this.add.graphics();
        this.happinessBar.fillStyle(0xff0000, 1);
        this.happinessBar.fillRect(x, y + barHeight + 10, (barWidth * this.setsuko.happiness) / 100, barHeight);

        this.healthBar = this.add.graphics();
        this.healthBar.fillStyle(0x0000ff, 1);
        this.healthBar.fillRect(x, y + 2 * (barHeight + 10), (barWidth * this.setsuko.health) / 100, barHeight);

        // Create food and toy sprites and set them interactive
        const bottomRightX = this.cameras.main.width - 100;
        const bottomRightY = this.cameras.main.height - 100;

        this.food = this.physics.add.sprite(bottomRightX - 100, bottomRightY, 'food').setInteractive();
        this.toy = this.physics.add.sprite(bottomRightX, bottomRightY, 'toy').setInteractive();

        // Create text objects for food and toy counters
        const bottomLeftX = 20;
        const bottomLeftY = this.cameras.main.height - 50;

        // Create colored background rectangles behind the text
        const foodTextBackground = this.add.graphics();
        foodTextBackground.fillStyle(0x000000, 0.7); // Black color with 70% opacity
        foodTextBackground.fillRect(bottomLeftX, bottomLeftY, 120, 30);

        const toyTextBackground = this.add.graphics();
        toyTextBackground.fillStyle(0x000000, 0.7); // Black color with 70% opacity
        toyTextBackground.fillRect(bottomLeftX + 140, bottomLeftY, 120, 30);

        // Create text objects with the counters
        this.foodText = this.add.text(bottomLeftX + 10, bottomLeftY + 5, 'Food: ' + this.inventory.food, {
            fontSize: '16px',
            fill: '#fff'
        });

        this.toyText = this.add.text(bottomLeftX + 150, bottomLeftY + 5, 'Toy: ' + this.inventory.toy, {
            fontSize: '16px',
            fill: '#fff'
        });


        // Set up the initial values for Setsuko's hunger, happiness, and health
        this.setsuko.hunger = 50;
        this.setsuko.happiness = 50;
        
        // Load the saved health from local storage or set the initial health to 100
        this.setsuko.health = parseInt(localStorage.getItem('setsukoHealth')) || 100;

        // Set up event listeners for the food and toy sprites
        this.food.on('pointerup', () => this.giveFood());
        this.toy.on('pointerup', () => this.giveToy());

        // Decrease health every second using a timer
        this.time.addEvent({
            delay: 3000, // 3 second
            callback: this.decreaseHealth,
            callbackScope: this,
            loop: true,
        });

        // Create text object for error message at the bottom of the screen
        this.errorMessage = this.add.text(this.cameras.main.centerX, this.cameras.main.height - 50, '', {
            fontSize: '32px',
            fill: '#ff0000',
            fontStyle: 'bold',
        }).setOrigin(0.5);
    }

    update() {
        this.setsuko.update();

        // Update the width of the bars based on Setsuko's hunger, happiness, and health values
        const barWidth = 200;
        const barHeight = 20;
        const x = this.cameras.main.width - barWidth - 50;
        const y = 50;

        // Update the hunger, happiness, and health bars based on the values
        this.hungerBar.clear();
        this.hungerBar.fillStyle(0xff0000, 1);
        this.hungerBar.fillRect(x, y, (barWidth * this.setsuko.hunger) / 100, barHeight);

        this.happinessBar.clear();
        this.happinessBar.fillStyle(0x00ff00, 1);
        this.happinessBar.fillRect(x, y + barHeight + 10, (barWidth * this.setsuko.happiness) / 100, barHeight);

        this.healthBar.clear();
        this.healthBar.fillStyle(0x0000ff, 1);
        this.healthBar.fillRect(x, y + 2 * (barHeight + 10), (barWidth * this.setsuko.health) / 100, barHeight);

        // Save Setsuko's health to local storage
        localStorage.setItem('setsukoHealth', this.setsuko.health.toString());

        // Check if health reaches zero to transition to the GameOverScene
        if (this.setsuko.health <= 0) {
            this.sound.stopAll();
            this.scene.start('EndScene');
        }

        this.food.on('pointerdown', () => {
            this.sound.play('select'); // Play the select sound when the food sprite is selected
            this.giveFood();
        });

        this.toy.on('pointerdown', () => {
            this.sound.play('select'); // Play the select sound when the toy sprite is selected
            this.giveToy();
        });
    }

    giveFood() {
        // Check if the player has collected any food items in the GatherScene
        if (this.inventory.food > 0) {
            // Decrease the food count in the inventory
            this.inventory.food--;
    
            // Increase Setsuko's hunger when giving food
            this.setsuko.hunger += 20;
            this.setsuko.hunger = Phaser.Math.Clamp(this.setsuko.hunger, 0, 100);
    
            // Update the text for the inventory counter
            this.foodText.setText('Food: ' + this.inventory.food);
        } else {
            // Show the error message
            this.showError('No food! Go gather items.');
        }
    }

    giveToy() {
        // Check if the player has collected any toy items in the GatherScene
        if (this.inventory.toy > 0) {
            // Decrease the toy count in the inventory
            this.inventory.toy--;
    
            // Increase Setsuko's happiness when giving a toy
            this.setsuko.happiness += 20;
            this.setsuko.happiness = Phaser.Math.Clamp(this.setsuko.happiness, 0, 100);
    
            // Update the text for the inventory counter
            this.toyText.setText('Toy: ' + this.inventory.toy);
        } else {
            // Show the error message
            this.showError('No toy! Go gather items.');
        }
    }

    decreaseHealth() {
        // Decrease Setsuko's health over time
        this.setsuko.health -= 10;
        this.setsuko.health = Phaser.Math.Clamp(this.setsuko.health, 0, 100);
    }

    showError(message) {
        // Set the error message text
        this.errorMessage.setText(message);

        // Display the error message for 2 seconds (2000 milliseconds)
        this.time.delayedCall(2000, () => {
            this.errorMessage.setText('');
        }, [], this);
    }
}

