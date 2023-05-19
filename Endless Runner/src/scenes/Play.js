const gameOptions = {
	obstacleSpeed: 400, // Adjust the obstacle speed to your desired value
	obstacleDelay: 1500, // Adjust the obstacle delay to make them spawn more frequently
  };
  
class Play extends Phaser.Scene {
	constructor() {
	super('playScene');
	this.score = 0; // Initialize the score variable
	//this.highScore = 0; // Initialize the high score variable
	}

	create() {
		// Reset the parameters
		this.score = 0;
		this.power = 0;
		this.gameSpeed = 1;

		// Set up the audio
		this.bgm = this.sound.add('bgmusic', {
			mute: false,
			volume: 1,
			rate: 1,
			loop: true,
		});

		// Play background music
		this.bgm.play();

		// Create the background
		this.sky = this.add
			.tileSprite(0, 0, this.sys.game.config.width, this.sys.game.config.height, 'sky')
			.setOrigin(0, 0);

		// Create the cloudsback
		this.cloudsback = this.add
			.tileSprite(0, 0, this.sys.game.config.width, this.sys.game.config.height, 'cloudsback')
			.setOrigin(0, 0);
		this.cloudsback.setScrollFactor(0.2); // Adjust the scrolling speed of cloudsback

		// Create the clouds
		this.clouds = this.add
			.tileSprite(0, 0, this.sys.game.config.width, this.sys.game.config.height, 'clouds')
			.setOrigin(0, 0);
		this.clouds.setScrollFactor(0.3); // Adjust the scrolling speed of clouds

		// Create the trees
		this.trees = this.add
			.tileSprite(0, 0, this.sys.game.config.width, this.sys.game.config.height, 'trees')
			.setOrigin(0, 0);
		this.trees.setScrollFactor(0.5); // Adjust the scrolling speed of trees

		// Create the ground
		const groundWidth = this.sys.game.config.width; // Set ground width to 1/4 of the screen
		const groundHeight = this.sys.game.config.height * 0.5; // Increase ground height
		const groundX = this.sys.game.config.width / 2; // Position ground at the center horizontally
		const groundY = this.sys.game.config.height - groundHeight / 2; // Position ground at the bottom
		this.ground = this.physics.add.staticImage(groundX, groundY, 'ground');
		this.ground.setScale(groundWidth / this.ground.width, groundHeight / this.ground.height);		
		
		
		// Create player
		this.player = this.physics.add.sprite(
			this.sys.game.config.width * 0.2,
			this.ground.y - this.ground.height / 2 - 25,
			'player'
		);
		this.player.setCollideWorldBounds(true);
		this.player.body.gravity.y = 2500; // Increase gravity for faster fall

		// Set up keyboard events
		this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

		// Set up jump sound
		this.jump = this.sound.add('jump');

		// Increase game speed every 5 seconds
		this.time.addEvent({ delay: 5000, callback: this.increaseGameSpeed, callbackScope: this, loop: true });

		// Create a group to hold the obstacles
		this.obstacleGroup = this.physics.add.group();

		// Set up a timer to spawn obstacles
		this.obstacleTimer = this.time.addEvent({
			delay: Phaser.Math.Between(2000, 4000),
			callback: this.spawnObstacle,
			callbackScope: this,
			loop: true,
		});

		// Spawn the initial obstacle
		this.spawnObstacle();

		// Add godrays
		this.sunlight = this.add
			.tileSprite(0, 0, this.sys.game.config.width, this.sys.game.config.height, 'sunlight')
			.setOrigin(0, 0);

		// Display the score on the top right of the screen
		this.scoreText = this.add
			.text(this.sys.game.config.width - 20, 20, `Score: ${this.score}`, { fontSize: '24px', fill: '#ffffff' })
			.setOrigin(1, 0);

		// Set up a timer to spawn obstacles
		this.obstacleTimer = this.time.addEvent({
			delay: gameOptions.obstacleDelay,
			callback: this.spawnObstacle,
			callbackScope: this,
			loop: true,
		});
		
		// Remove hs
		// // Retrieve the high score from local storage
		// const storedHighScore = localStorage.getItem('highScore');
		// if (storedHighScore) {
		// 	this.highScore = parseInt(storedHighScore); // Parse the stored value to an integer
		// }
	}
  
	spawnObstacle() {
		// Randomly choose the type of obstacle
		const obstacleType = Phaser.Math.Between(0, 1);
	  
		// Set the obstacle's properties based on its type
		let obstacleX;
		let obstacleY;
		let obstacleVelocityX;
		let obstacle;
	  
		if (obstacleType === 0) {
			// Ground obstacle
			obstacleX = this.sys.game.config.width + Phaser.Math.Between(200, 400); // Generate a random X position within a larger range
			obstacleY = this.ground.y + this.ground.height / 6.5; // Generate a random Y position below the ground
			obstacleVelocityX = -gameOptions.obstacleSpeed;
			obstacle = this.physics.add.sprite(obstacleX, obstacleY, 'obstacle');
		} else {
			// Flying obstacle
			obstacleX = this.sys.game.config.width + Phaser.Math.Between(200, 400); // Generate a random X position within a larger range
			obstacleY = Phaser.Math.Between(this.sys.game.config.height * 0.1, this.sys.game.config.height * 0.3); // Generate a random Y position within a range
			obstacleVelocityX = -gameOptions.obstacleSpeed * 1.5; // Set a higher velocity for flying obstacles
			obstacle = this.physics.add.sprite(obstacleX, obstacleY, 'flyingobstacle');
		}
	  
		// Check if the obstacle overlaps with any existing obstacle in the group
		const overlappingObstacles = this.obstacleGroup.getChildren().some((existingObstacle) => {
		  	return Math.abs(existingObstacle.x - obstacleX) <= existingObstacle.width;
		});
	  
		if (overlappingObstacles) {
			// If overlapping occurs, adjust the X position of the obstacle
			obstacleX += obstacle.width;
			obstacle.x = obstacleX;
		}
	  
		obstacle.setVelocityX(obstacleVelocityX);
		this.obstacleGroup.add(obstacle);
	  
		// Set up a new timer for the next obstacle
		this.obstacleTimer.delay = Phaser.Math.Between(2000, 4000) + obstacleX / Math.abs(obstacleVelocityX);
	}
	  
	  
  
	doJump() {
		const jumpVelocity = -1200; // Fixed velocity for the jump
		this.player.setVelocityY(jumpVelocity);
		this.jump.play(); // Play the jump sound
	  
		// Increase the score when the player jumps
		this.score++;
		this.scoreText.setText(`Score: ${this.score}`);
	  
		// Increase game speed every 5 jumps
		if (this.score % 5 === 0) {
		  	this.increaseGameSpeed();
		}
	  }
	  
  
	increaseGameSpeed() {
		this.gameSpeed += 0.2;
		this.physics.world.timeScale = this.gameSpeed;
	
		// Increase obstacle speed
		gameOptions.obstacleSpeed += 50;
	
		// Adjust scrolling speed of background elements
		this.clouds.tilePositionX += 0.3 * this.gameSpeed;
		this.cloudsback.tilePositionX += 0.2 * this.gameSpeed;
		this.trees.tilePositionX += 0.5 * this.gameSpeed;
	}
  
	// updateHighScore() {
	// 	if (this.score > this.highScore) {
	// 		this.highScore = this.score;
	
	// 		// Store the new high score in local storage
	// 		localStorage.setItem('highScore', this.highScore);
	
	// 		// Update the high score text
	// 		this.highScoreText.setText(`High Score: ${this.highScore}`);
	// 	}
	// }
  
	update() {
		// Scroll the background, cloudsback, and trees
		this.sky.tilePositionX += 0.5;
		this.cloudsback.tilePositionX += 0.2;
		this.clouds.tilePositionX += 0.3;
		this.trees.tilePositionX += 0.5;
	
		// Check for collision with the ground
		this.physics.world.collide(this.player, this.ground, this.handleCollision, null, this);
	
		// Check for spacebar input to jump
		if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
			this.doJump();
		}
	
		// Move the obstacles with the background
		this.obstacleGroup.setVelocityX(-gameOptions.obstacleSpeed * this.gameSpeed);
	
		// Check for collision with obstacles
		this.physics.world.collide(this.player, this.obstacleGroup, this.gameOver, null, this);
	}
  
	gameOver() {
		// Stop the game and display the game over screen
		this.physics.pause();
		this.bgm.stop();
		//this.updateHighScore();
		this.scene.start('gameOverScene', { score: this.score});
	}
  
	handleCollision() {
		if (this.player.body.touching.down) {
			// Reset player's velocity when touching the ground
			this.player.setVelocityY(0);
		}
	}
}


  