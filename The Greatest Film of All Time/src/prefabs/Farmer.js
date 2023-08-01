class Farmer extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'farmer', 0);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.anims.create({
            key: 'left',
            frameRate: 10,
            frames: this.anims.generateFrameNumbers('farmer', { start: 1, end: 1 }),
        });

        this.anims.create({
            key: 'right',
            frameRate: 10,
            frames: this.anims.generateFrameNumbers('farmer', { start: 2, end: 2 }),
        });

        this.anims.create({
            key: 'up',
            frameRate: 10,
            frames: this.anims.generateFrameNumbers('farmer', { start: 3, end: 3 }),
        });

        this.anims.create({
            key: 'down',
            frameRate: 10,
            frames: this.anims.generateFrameNumbers('farmer', { start: 0, end: 0 }),
        });
        
        this.play('left');

        // Add line of sight zones for the farmer
        this.zoneLeft = scene.add.rectangle(x - 100, y, 100, 90, 0xff0000);
        this.zoneLeft.visible = false;

        this.zoneDown = scene.add.rectangle(x, y + 100, 100, 90, 0xff0000);
        this.zoneDown.visible = false;

        this.zoneRight = scene.add.rectangle(x + 100, y, 100, 90, 0xff0000);
        this.zoneRight.visible = false;

        this.zoneUp = scene.add.rectangle(x, y - 100, 100, 90, 0xff0000);
        this.zoneUp.visible = false;

        scene.physics.add.existing(this.zoneLeft);
        scene.physics.add.existing(this.zoneDown);
        scene.physics.add.existing(this.zoneRight);
        scene.physics.add.existing(this.zoneUp);

        this.setImmovable(true);
    }

    update() {
        const playerInLineOfSightLeft = this.anims.currentAnim.key === 'left' && Phaser.Geom.Rectangle.ContainsPoint(this.zoneLeft.getBounds(), this.scene.player);
        const playerInLineOfSightDown = this.anims.currentAnim.key === 'down' && Phaser.Geom.Rectangle.ContainsPoint(this.zoneDown.getBounds(), this.scene.player);
        const playerInLineOfSightRight = this.anims.currentAnim.key === 'right' && Phaser.Geom.Rectangle.ContainsPoint(this.zoneRight.getBounds(), this.scene.player);
        const playerInLineOfSightUp = this.anims.currentAnim.key === 'up' && Phaser.Geom.Rectangle.ContainsPoint(this.zoneUp.getBounds(), this.scene.player);

        this.zoneLeft.visible = this.anims.currentAnim.key === 'left';
        this.zoneDown.visible = this.anims.currentAnim.key === 'down';
        this.zoneRight.visible = this.anims.currentAnim.key === 'right';
        this.zoneUp.visible = this.anims.currentAnim.key === 'up';

        if (playerInLineOfSightLeft || playerInLineOfSightDown || playerInLineOfSightRight || playerInLineOfSightUp) {
            this.scene.scene.start('GameOverScene');
        }
    }

    changeDirection() {
        const directions = ['left', 'down', 'right', 'up'];
        const currentDirection = this.anims.currentAnim.key;
        const nextDirection = directions[(directions.indexOf(currentDirection) + 1) % directions.length];
        this.play(nextDirection);
    }
}
