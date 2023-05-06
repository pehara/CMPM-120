class Menu extends Phaser.Scene {
  constructor() {
    super("menuScene");
  }
  
  preload() {
    // load audio
    this.load.audio('sfx_select', './assets/blip_select12.wav');
    this.load.audio('sfx_explosion', './assets/explosion38.wav');
    this.load.audio('sfx_rocket', './assets/rocket_shot.wav');
    this.load.image('menubg', './assets/menubg.png');
  }
  
  

  create() {
    // new menu screen mod
    this.menubg = this.add.tileSprite(0, 0, 640, 480, 'menubg').setOrigin(0, 0);

    // define keys
    keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
      // Novice mode
      game.settings = {
        spaceshipSpeed: 3,
        FastSpaceship: 4,
        gameTimer: 60000,
        // speed increase after 30 seconds
        speedIncreaseTime: 30000
      }
      this.sound.play('sfx_select');
      this.scene.start("playScene");    
    }
    if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
      // Expert mode
      game.settings = {
        spaceshipSpeed: 4,
        FastSpaceship: 5,
        gameTimer: 45000,
        // speed increase after 15 seconds
        speedIncreaseTime: 15000
      }
      this.sound.play('sfx_select');
      this.scene.start("playScene");    
    }
  }
}
