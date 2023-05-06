class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue, frameRate) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.points = pointValue;
        this.moveSpeed = game.settings.spaceshipSpeed;
        this.frameRate = frameRate;
        this.init();
    }

    init() {
        this.anims.create({
            key: 'shipAnim',
            frames: this.anims.generateFrameNumbers('spaceship', { start: 0, end: 3, first: 0 }),
            frameRate: this.frameRate,
            repeat: -1
        });
        this.play('shipAnim');
    }

    update() {
        this.x -= this.moveSpeed;
        if(this.x <= -this.width) {
            this.reset();
        }
    }

    reset() {
        this.x = game.config.width;
    }
}
