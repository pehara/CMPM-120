class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('starfield', './assets/starfield.png');
        this.load.image('clouds_back', './assets/clouds_back.png');
        this.load.image('clouds_front', './assets/clouds_front.png');
        
        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
        this.load.spritesheet('spaceship', './assets/spaceship.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
        // this.load.spritesheet('fastspaceship', './assets/fastspaceship.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    
        // load background music
        this.load.audio('background_music', ['./assets/background_music.mp3', './assets/background_music.ogg']);
        
        //explosion
        this.load.audio('explosion1', './assets/explosion1.wav');
        this.load.audio('explosion2', './assets/explosion2.wav');
        this.load.audio('explosion3', './assets/explosion3.wav');
        this.load.audio('explosion4', './assets/explosion38.wav');
    }


    create() {
        // play background music
        this.sound.add('background_music', { loop: true, volume: 0.5 }).play();

        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);

        // create the clouds layer and set its depth
        this.clouds_back = this.add.tileSprite(0, 0, 640, 480, 'clouds_back').setOrigin(0, 0);
        this.clouds_front = this.add.tileSprite(0, 0, 640, 480, 'clouds_front').setOrigin(0, 0);

        // set tile sprite positions
        this.starfield.setScrollFactor(0);
        this.clouds_back.setScrollFactor(0);
        this.clouds_front.setScrollFactor(0);

        // set tile sprite speeds
        this.starfieldSpeed = 0.1;
        this.clouds_backSpeed = 0.3;
        this.clouds_frontSpeed = 0.5;

        // pink UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0xE73289).setOrigin(0, 0);
        
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);

        // add Rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);
        this.p1Rocket.setDepth(1);

        // add Spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship', 0, 30, 5).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20, 8).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 10, 12).setOrigin(0,0);
        // this.ship04 = new FastSpaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 10, 12).setOrigin(0,0);

        this.anims.create({
            key: 'shipAnim',
            frames: this.anims.generateFrameNumbers('spaceship', { start: 0, end: 3, first: 0 }),
            frameRate: 20,
            repeat: -1
        });

        // this.anims.create({
        //     key: 'fastShipAnim',
        //     frames: this.anims.generateFrameNumbers('fastShipAnim', { start: 0, end: 3, first: 0 }),
        //     frameRate: 20,
        //     repeat: -1
        // });
        
        this.ship01.play('shipAnim');
        this.ship02.play('shipAnim');
        this.ship03.play('shipAnim');     
        // this.ship04.play('fastShipAnim'); 

        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { 
                start: 0, 
                end: 9, 
                first: 0
            }),
            frameRate: 30
        });

        // initialize score
        this.p1Score = 0;

        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F8D2EA',
            color: '#B33872',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }

        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);

        // GAME OVER flag
        this.gameOver = false;

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← to Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);

        this.speedIncreased = false; // flag to check if speed has increased

        // add particle emitter
        this.particles = this.add.particles('particle');

        // create particle emitter object
        this.emitter = this.particles.createEmitter({
            speed: { min: -200, max: 200 },
            angle: { value: 0, spread: 360 },
            scale: { start: 0.5, end: 0 },
            alpha: { start: 1, end: 0 },
            blendMode: 'ADD',
            lifespan: 1000,
            gravityY: 800
        });

    }

    update() {
        // scroll tile sprite
        this.starfield.setScrollFactor(1, 0);
        this.clouds_back.setScrollFactor(2, 0);
        this.clouds_front.setScrollFactor(2.5, 0);
        
        // check key input for restart / menu
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }

        // Check for the input key for the menu
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        // Parallax background scrolling
        this.starfield.tilePositionX -= 4;  // update tile sprite
        this.clouds_back.tilePositionX -= 3;  // update tile sprite
        this.clouds_front.tilePositionX -= 2;  // update tile sprite


        if(!this.gameOver) {
            this.p1Rocket.update();             // update p1
            
            this.ship01.update();               // update spaceship (x3)
            this.ship02.update();
            this.ship03.update();
            // this.ship04.update();
        }

        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
        // if (this.checkCollision(this.p1Rocket, this.ship04)) {
        //     this.p1Rocket.reset();
        //     this.shipExplode(this.ship04);
        // }
        
        // Speed of ships mod
        if (!this.gameOver) {
            // Update spaceship speeds based on score
            if (this.p1Score >= 100 && !this.speedIncreased) {
            this.ship01.moveSpeed += 2;
            this.ship02.moveSpeed += 2;
            this.ship03.moveSpeed += 2;
            // this.ship04.moveSpeed += 3;
            this.speedIncreased = true;
            }
            
            this.p1Rocket.update();             // update p1
            this.ship01.update();               // update spaceship (x3)
            this.ship02.update();
            this.ship03.update();
            // this.ship04.update();
        }
    }

    hitSpaceship(rocket, spaceship) {
        // emit particles
        this.emitter.explode(20, spaceship.x, spaceship.y);

        // play random explosion sound
        let explosionSound = Phaser.Math.RND.pick(this.explosionSounds);
        explosionSound.play();

        // hide spaceship
        spaceship.reset();

        // score increment and repaint
        this.p1Score += spaceship.points;
        this.scoreLeft.text = this.p1Score;
    }


    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
                return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;                         
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
            ship.reset();                         // reset ship position
            ship.alpha = 1;                       // make ship visible again
            boom.destroy();                       // remove explosion sprite
        });
        // score add and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score; 
        
        // choose a random explosion sound effect
        const randomExplosion = Phaser.Math.Between(1, 4);
        const explosionSound = this.sound.add(`explosion${randomExplosion}`);

        // play the sound effect and destroy the ship
        explosionSound.play();
        //ship.destroy();
    }
    
}

    // Hehe
