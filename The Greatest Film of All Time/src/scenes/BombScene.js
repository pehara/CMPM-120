class BombScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BombScene' });
        this.isRunningSoundPlaying = false;
    }

    create() {
        // Start playing the background music
        this.sound.play('bombairraidbgm', { loop: true });
        this.sound.play('bombefirebgm', { loop: true });
        this.sound.play('bombbgm', { loop: true });

        // Create the tile map and connect it to the JSON file
        const map = this.add.tilemap("map");

        // const map = this.add.tilemap({ key: 'map', tileWidth: 75, tileHeight: 57 });

        const tileset = map.addTilesetImage('scene1Assets', 'tiles');

        // Create layers for the tilemap
        const backgroundLayer = map.createLayer('grass', tileset, 0, 0);

        const housesLayer = map.createLayer('houses', tileset, 0, 0);
        
        const pathLayer = map.createLayer('path', tileset, 0, 0);

        // Set up collision for layers
        // backgroundLayer.setCollisionByExclusion([-1]);
        housesLayer.setCollisionByProperty({ collides: true });

        // Adding player with animation
        this.player = this.physics.add.sprite(120, 1650, 'player');
        this.player.setCollideWorldBounds(true); // Ensure the player stays within the world bounds


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
        
        // Set up player collisions with the world (only collide with housesLayer)
        this.physics.add.collider(this.player, housesLayer);

        // Setup cursor keys
        this.cursors = this.input.keyboard.createCursorKeys();
    
        // Enable collision between player and tilemap layers
        this.physics.add.collider(this.player, housesLayer);
    
        // Create 'bombexit' sprite and add it to the scene
        this.bombexit = this.physics.add.sprite(2235, 32, 'bombexit');
            
        // Set up collision between player and 'bombexit'
        this.physics.add.overlap(this.player, this.bombexit, this.handleBombExitCollision, null, this);
    
        //Setup camera to follow the player
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player, true, 0.25, 0.25);
    
        this.physics.world.bounds.setTo(0, 0, map.widthInPixels, map.heightInPixels);

        // Create a group for bombs, explosions, and fires
        this.bombsGroup = this.physics.add.group();
        this.explosionsGroup = this.physics.add.group();
        this.firesGroup = this.physics.add.group();

        // Spawn bombs every few seconds
        this.spawnBombs();

        // Set up collision between player and bombs
        this.physics.add.overlap(this.player, this.bombsGroup, this.handleBombCollision, null, this);

        // Set up collision between player and explosions
        this.physics.add.overlap(this.player, this.explosionsGroup, this.handleExplosionCollision, null, this);

        // Set up collision between player and fires
        this.physics.add.overlap(this.player, this.firesGroup, this.handleFireCollision, null, this);
    }
    
    update() {
        // If the player is moving, play 'runningchar' sound
        const isMoving = this.player.body.velocity.x !== 0 || this.player.body.velocity.y !== 0;
        if (isMoving && !this.isRunningSoundPlaying) {
            this.isRunningSoundPlaying = true;
            this.sound.play('runningchar', { loop: true, volume: 0.3 });
        } else if (!isMoving && this.isRunningSoundPlaying) {
            this.isRunningSoundPlaying = false;
            this.sound.stopByKey('runningchar');
        }

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
    }
    

    handleBombExitCollision() {
        this.sound.stopAll();
        this.scene.start('Cutscene2Scene'); // Transition to the next scene
    }

    spawnBombs() {
        // Spawn bombs more frequently (around 3 per second)
        this.time.addEvent({
            delay: Phaser.Math.RND.between(2000, 3000), // Random delay between 2 and 3 seconds
            loop: true,
            callback: () => {
                for (let i = 0; i < 3; i++) {
                    const randomX = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
                    const randomY = Phaser.Math.RND.between(0, this.physics.world.bounds.height);

                    const bomb = this.bombsGroup.create(randomX, randomY, 'bomb');
                    bomb.setOrigin(0.5, 0.5);

                    // Add a timer to change the bomb to an explosion after 5 seconds
                    this.time.addEvent({
                        delay: 5000, // 5 seconds
                        callback: () => this.explodeBomb(bomb),
                        callbackScope: this,
                        loop: false,
                    });
                }
            },
        });
    }

    explodeBomb(bomb) {
        // Destroy the bomb sprite and create an explosion sprite in its place
        bomb.destroy();

        const explosion = this.physics.add.sprite(bomb.x, bomb.y, 'explosion');
        explosion.setOrigin(0.5, 0.5);

        // Add the explosion to a group
        if (!this.explosionsGroup) {
            this.explosionsGroup = this.physics.add.group();
        }
        this.explosionsGroup.add(explosion);

        // Add a timer to change the explosion to fire after 2 seconds
        this.time.addEvent({
            delay: 2000, // 2 seconds
            callback: () => this.turnToFire(explosion),
            callbackScope: this,
            loop: false,
        });
    }

    turnToFire(explosion) {
        // Check if the explosion sprite still exists before creating the fire sprite
        if (explosion && !explosion.destroyed) {
            // Destroy the explosion sprite and create a fire sprite in its place
            explosion.destroy();
    
            const fire = this.physics.add.sprite(explosion.x, explosion.y, 'fire');
            fire.setOrigin(0.5, 0.5);
    
            // Add the fire to a group
            if (!this.firesGroup) {
                this.firesGroup = this.physics.add.group();
            }
            this.firesGroup.add(fire);
        }
    }
    

    handleBombCollision(player, bomb) {
        // Transition to the game over scene if the player collides with a bomb
        //this.scene.start('GameOverScene');
    }

    handleExplosionCollision(player, explosion) {
        // Transition to the game over scene if the player collides with an explosion
        this.sound.stopAll();
        this.scene.start('GameOverScene');
    }

    handleFireCollision(player, fire) {
        // Transition to the game over scene if the player collides with fire
        this.sound.stopAll();
        this.scene.start('GameOverScene');
    }
}

