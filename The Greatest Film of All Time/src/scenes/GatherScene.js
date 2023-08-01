class GatherScene extends Phaser.Scene {
	constructor() {
	  	super({ key: 'GatherScene' });

		// Create an inventory object
		this.inventory = {
			food: 0,
			toy: 0
		};
	}
  
	create() {
		// Start playing the background music
        this.sound.play('gatherbgm', { loop: true });
    
		// Create the tile map and connect it to the JSON file
		const map = this.make.tilemap({ key: 'map', tileWidth: 75, tileHeight: 57 });
		const tileset = map.addTilesetImage('scene1Assets', 'tiles');
	
		// Create layers for the tilemap
		const backgroundLayer = map.createLayer('grass', tileset, 0, 0);
		const housesLayer = map.createLayer('houses', tileset, 0, 0);
		const pathLayer = map.createLayer('path', tileset, 0, 0);
	
		// Set up collision for layers
		backgroundLayer.setCollisionByProperty({ collides: true });
		housesLayer.setCollisionByProperty({ collides: true });
		
		// Adding farmer
		this.farmer = this.physics.add.sprite(1000, 400, 'farmer', 0);
		
		this.farmer2 = this.physics.add.sprite(1300, 1500, 'farmer', 0);

		//Farmer animation display
		this.anims.create({
			key: 'left',
			frameRate: 10,
			frames: this.anims.generateFrameNumbers('farmer', {
				start: 1,
				end: 1
			})
		})

		this.anims.create({
			key: 'right',
			frameRate: 10,
			frames: this.anims.generateFrameNumbers('farmer', {
				start: 2,
				end: 2
			})
		})

		this.anims.create({
			key: 'up',
			frameRate: 10,
			frames: this.anims.generateFrameNumbers('farmer', {
				start: 3,
				end: 3
			})
		});

		this.anims.create({
			key: 'down',
			frameRate: 10,
			frames: this.anims.generateFrameNumbers('farmer', {
				start: 0,
				end: 0
			})
		});

		this.farmer.play('left');
		this.farmer2.play('right');
		

		// Setting farmer sprite depth to ensure they are in front of the background
		this.farmer.setDepth(1);
		
		this.farmer2.setDepth(1);

		// Set up timer to change farmer direction every 5 seconds
		this.changeFarmerDirectionTimer1 = this.time.addEvent({
			delay: 5000, // 5000 milliseconds = 5 seconds
			loop: true,
			callback: this.changeFarmerDirection,
			callbackScope: { farmer: this.farmer }
		});

		this.changeFarmerDirectionTimer2 = this.time.addEvent({
			delay: 5000, // 5000 milliseconds = 5 seconds
			loop: true,
			callback: this.changeFarmerDirection,
			callbackScope: { farmer: this.farmer2 }
		});

		// Setting to immovable
		this.farmer.setImmovable(true);
		this.farmer2.setImmovable(true);

		this.farmers = this.add.group({
			maxSize: 5
		});
		// Line of sight zones for each farmer
		// farmer 1
		this.zone1left = this.add.rectangle(this.farmer.x - 100, this.farmer.y, 100, 90, 0xff0000); // left
		this.zone1left.visible = false;

		this.zone2down = this.add.rectangle(this.farmer.x, this.farmer.y + 100, 100, 90, 0xff0000); // down
		this.zone2down.visible = false;

		this.zone6right = this.add.rectangle(this.farmer.x + 100, this.farmer.y, 100, 90, 0xff0000); // right
		this.zone6right.visible = false;

		this.zone7up = this.add.rectangle(this.farmer.x, this.farmer.y - 100, 100, 90, 0xff0000); // up
		this.zone7up.visible = false;

		// farmer 2
		this.zone3right2 = this.add.rectangle(this.farmer2.x - 100, this.farmer2.y, 100, 90, 0xff0000); // right
		this.zone3right2.visible = false;

		this.zone4up2 = this.add.rectangle(this.farmer2.x, this.farmer2.y + 100, 100, 90, 0xff0000); // up
		this.zone4up2.visible = false;

		this.zone5left2 = this.add.rectangle(this.farmer2.x + 100, this.farmer2.y, 100, 90, 0xff0000); // left
		this.zone5left2.visible = false;

		this.zone8down2 = this.add.rectangle(this.farmer2.x, this.farmer2.y - 100, 100, 90, 0xff0000); // down
		this.zone8down2.visible = false;

		// this.detectionBoxes = this.add.group();

		//Add detecting zones to physics
		this.physics.add.existing(this.zone1left);
		this.physics.add.existing(this.zone2down);
		this.physics.add.existing(this.zone6right);
		this.physics.add.existing(this.zone7up);

		this.physics.add.existing(this.zone3right2);
		this.physics.add.existing(this.zone4up2);
		this.physics.add.existing(this.zone5left2);
		this.physics.add.existing(this.zone8down2);
		
		// Adding player
		this.player = this.physics.add.sprite(2200, 180, 'player');
		// Set up player collisions with the world
		this.player.body.collideWorldBounds = true; // Ensure the player stays within the world bounds

		// Set up player animations
        this.anims.create({
            key: 'move_up',
            frames: this.anims.generateFrameNumbers('player', { start: 6, end: 7 }),
            frameRate: 8,
            repeat: -1,
            callbackScope: this // Make sure to set the callback scope to the scene

        });

        this.anims.create({
            key: 'move_down',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 1 }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'move_left',
            frames: this.anims.generateFrameNumbers('player', { start: 2, end: 3 }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'move_right',
            frames: this.anims.generateFrameNumbers('player', { start: 4, end: 5 }),
            frameRate: 8,
            repeat: -1
        });
		
		// Add collision between player and farmer
		this.physics.add.collider(this.player, this.farmer, this.handlePlayerFarmerCollision, null, this);
		this.physics.add.collider(this.player, this.farmer2, this.handlePlayerFarmerCollision, null, this);

	
		// Setup cursor keys
		this.cursors = this.input.keyboard.createCursorKeys();
	
		// Enable collision between player and tilemap layers
		this.physics.add.collider(this.player, housesLayer);
	
		// Create 'homeexit' sprite and add it to the scene
		this.homeexit = this.physics.add.sprite(2235, 2, 'homeexit');
			
		// Set up collision between player and 'homeexit'
		this.physics.add.overlap(this.player, this.homeexit, this.handlehomeexitCollision, null, this);
		
		//Setup camera to follow the player
		this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
		this.cameras.main.startFollow(this.player, true, 0.25, 0.25);
	
		this.physics.world.bounds.setTo(0, 0, map.widthInPixels, map.heightInPixels);
		
		// Create a group for food items and add detecting zones to physics
		this.foodGroup = this.physics.add.group();
		this.foodGroup.create(400, 300, 'food').setScale(0.4);
		this.foodGroup.create(1544, 108, 'food').setScale(0.4);
		this.foodGroup.create(492, 768, 'food').setScale(0.4);
		this.foodGroup.create(636, 1728, 'food').setScale(0.4);
		this.foodGroup.create(1655, 1408, 'food').setScale(0.4);
		this.foodGroup.create(492, 768, 'food').setScale(0.4);
		this.foodGroup.create(2971, 1029, 'food').setScale(0.4);
		this.foodGroup.create(220, 1700, 'food').setScale(0.4);
		this.foodGroup.create(872, 182, 'food').setScale(0.4);

		this.foodGroup.children.iterate((food) => {
			food.setImmovable(true);
			this.physics.add.overlap(this.player, food, this.collectItem, null, this);
		});
 
		// Create a group for toy items and add detecting zones to physics
		this.toyGroup = this.physics.add.group();
		this.toyGroup.create(600, 300, 'toy').setScale(0.4);
		this.toyGroup.create(518, 1664, 'toy').setScale(0.4);
		this.toyGroup.create(1714, 568, 'toy').setScale(0.4);
		this.toyGroup.create(708, 120, 'toy').setScale(0.4);
		this.toyGroup.create(668, 864, 'toy').setScale(0.4);
		this.toyGroup.create(1640, 1128, 'toy').setScale(0.4);
		this.toyGroup.create(1500, 1000, 'toy').setScale(0.4);
		this.toyGroup.create(1920, 192, 'toy').setScale(0.4);
		this.toyGroup.create(689, 999, 'toy').setScale(0.4);

		this.toyGroup.children.iterate((toy) => {
			toy.setImmovable(true);
			this.physics.add.overlap(this.player, toy, this.collectItem, null, this);
		});

		// Adding text for the inventory counters
		this.foodText = this.add.text(this.cameras.main.width - 150, this.cameras.main.height - 30, 'Food: 0', {
			fontSize: '20px',
			fill: '#ffffff',
			backgroundColor: '#000000'
		}).setScrollFactor(0);
	
		this.toyText = this.add.text(this.cameras.main.width - 150, this.cameras.main.height - 60, 'Toy: 0', {
			fontSize: '20px',
			fill: '#ffffff',
			backgroundColor: '#000000'
		}).setScrollFactor(0);

		// Disable debug rendering for the physics system
        this.physics.world.debugGraphic.setVisible(false);

	}
  
	update() {
		// Set up player movement
		this.player.setVelocityY(0);
		this.player.setVelocityX(0);

		if (this.cursors.up.isDown) {
            this.player.setVelocityY(-300);
            this.player.anims.play('move_up', true);
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(300);
            this.player.anims.play('move_down', true);
        } else if (this.cursors.left.isDown) {
            this.player.setVelocityX(-300);
            this.player.anims.play('move_left', true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(300);
            this.player.anims.play('move_right', true);
        } else {
            // If no cursor keys are pressed, stop the animation and display the idle frame
            this.player.anims.stop();
        }

		if (this.farmer.anims.currentAnim.key === 'left') {
			this.physics.overlap(this.player, this.zone1left);
			this.turnFarmer(this.farmer, 'down');
		} else if (this.farmer.anims.currentAnim.key === 'down') {
			this.physics.overlap(this.player, this.zone2down);
			this.turnFarmer(this.farmer, 'right');
		} else if (this.farmer.anims.currentAnim.key === 'right') {
			this.physics.overlap(this.player, this.zone6right);
			this.turnFarmer(this.farmer, 'up');
		} else if (this.farmer.anims.currentAnim.key === 'up') {
			this.physics.overlap(this.player, this.zone7up);
			this.turnFarmer(this.farmer, 'left');
		}

		if (this.farmer2.anims.currentAnim.key === 'left') {
			this.physics.overlap(this.player, this.zone5left2);
			this.turnFarmer(this.farmer2, 'down');
		} else if (this.farmer2.anims.currentAnim.key === 'down') {
			this.physics.overlap(this.player, this.zone8down2);
			this.turnFarmer(this.farmer2, 'right');
		} else if (this.farmer2.anims.currentAnim.key === 'right') {
			this.physics.overlap(this.player, this.zone3right2);
			this.turnFarmer(this.farmer2, 'up');
		} else if (this.farmer2.anims.currentAnim.key === 'up') {
			this.physics.overlap(this.player, this.zone4up2);
			this.turnFarmer(this.farmer2, 'left');
		}

		// Line of sight for farmer 1
		const playerInLineOfSight1 = this.farmer.anims.currentAnim.key === 'left' && Phaser.Geom.Rectangle.ContainsPoint(this.zone1left.getBounds(), this.player);
		const playerInLineOfSight2 = this.farmer.anims.currentAnim.key === 'down' && Phaser.Geom.Rectangle.ContainsPoint(this.zone2down.getBounds(), this.player);
		const playerInLineOfSight6 = this.farmer.anims.currentAnim.key === 'right' && Phaser.Geom.Rectangle.ContainsPoint(this.zone6right.getBounds(), this.player);
		const playerInLineOfSight7 = this.farmer.anims.currentAnim.key === 'up' && Phaser.Geom.Rectangle.ContainsPoint(this.zone7up.getBounds(), this.player);

		// Line of sight for farmer 2
		const playerInLineOfSight3 = this.farmer2.anims.currentAnim.key === 'right' && Phaser.Geom.Rectangle.ContainsPoint(this.zone3right2.getBounds(), this.player);
		const playerInLineOfSight4 = this.farmer2.anims.currentAnim.key === 'up' && Phaser.Geom.Rectangle.ContainsPoint(this.zone4up2.getBounds(), this.player);
		const playerInLineOfSight5 = this.farmer2.anims.currentAnim.key === 'left' && Phaser.Geom.Rectangle.ContainsPoint(this.zone5left2.getBounds(), this.player);
		const playerInLineOfSight8 = this.farmer2.anims.currentAnim.key === 'down' && Phaser.Geom.Rectangle.ContainsPoint(this.zone8down2.getBounds(), this.player);

		// Hide all zones
		this.zone1left.visible = false;
		this.zone2down.visible = false;
		this.zone6right.visible = false;
		this.zone7up.visible = false;
		
		this.zone3right2.visible = false;
		this.zone4up2.visible = false;
		this.zone5left2.visible = false;
		this.zone8down2.visible = false;

		// // Set visibility for the zones the farmers face
		// if (this.farmer.anims.currentAnim.key === 'left') {
		// 	this.zone1left.visible = true;
		// 	this.zone5left2.visible = true;
		// } else if (this.farmer.anims.currentAnim.key === 'down') {
		// 	this.zone2down.visible = true;
		// 	this.zone8down2.visible = true;
		// } else if (this.farmer.anims.currentAnim.key === 'right') {
		// 	this.zone3right2.visible = true;
		// 	this.zone6right.visible = true;
		// } else if (this.farmer.anims.currentAnim.key === 'up') {
		// 	this.zone4up2.visible = true;
		// 	this.zone7up.visible = true;
		// }

		// Check if the player is detected by any zone and trigger game over scene
		if (playerInLineOfSight1 || playerInLineOfSight2 || playerInLineOfSight6 || playerInLineOfSight7) {
			this.sound.stopAll();
			this.scene.start('GameOverScene');
		} else if (playerInLineOfSight3 || playerInLineOfSight4 || playerInLineOfSight5 || playerInLineOfSight8) {
			this.sound.stopAll();
			this.scene.start('GameOverScene');
		}

	}

	// Handle collision with the enemy's line of sight
	handleZoneCollision(player, zone) {
		// Check if the player is detected and trigger the game over scene
		this.sound.stopAll();
		this.scene.start('GameOverScene');
	}
  
	collectItem(player, item) {
		if (item.texture.key === 'food') {
			// Increment the food count in the inventory
			this.inventory.food++;
	
			// Remove the food sprite from the scene
			item.destroy();
		} else if (item.texture.key === 'toy') {
			// Increment the toy count in the inventory
			this.inventory.toy++;
	
			// Remove the toy sprite from the scene
			item.destroy();
		}
	}

	handlePlayerFarmerCollision(player, farmer) {
		// Start the game over scene
		this.sound.stopAll();
		this.scene.start('GameOverScene');
	}


	handlehomeexitCollision() {
		this.sound.stopAll();
		this.scene.start('FeedSetsukoScene', { inventory: this.inventory });
	}

	//Helper function farmer turn around
	turnFarmer(sprite1, anim){
		this.time.delayedCall(4500, () => {
			sprite1.play(anim);
		}, null, this);

	}

	collectItem(player, item) {
		if (item.texture.key === 'food' && this.inventory.food === 0) {
			// Increment the food count in the inventory
			this.inventory.food++;
			this.foodText.setText('Food: ' + this.inventory.food);
	
			// Remove the food sprite from the scene
			item.destroy();
		} else if (item.texture.key === 'toy' && this.inventory.toy === 0) {
			// Increment the toy count in the inventory
			this.inventory.toy++;
			this.toyText.setText('Toy: ' + this.inventory.toy);
	
			// Remove the toy sprite from the scene
			item.destroy();
		} else if (!this.warningDisplayed) {
			// Display a warning message for attempting to collect more items
			this.warningDisplayed = true;
			const warningText = this.add.text(this.player.x, this.player.y - 30, 'Inventory Full!', {
				fontSize: '20px',
				fill: '#ff0000'
			}).setOrigin(0.5, 0.5);
	
			// Remove the warning message after two seconds
			this.time.delayedCall(2000, () => {
				warningText.destroy();
				this.warningDisplayed = false;
			}, null, this);
		}
	}
	
}

  