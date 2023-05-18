class obstacle extends Phaser.Physics.Arcade.Sprite {
    create() {
        // Create a group to hold the obstacles
        this.obstacleGroup = this.physics.add.group();

        // Set up a timer to spawn obstacles
        this.obstacleTimer = this.time.addEvent({
            delay: Phaser.Math.Between(2000, 4000),
            callback: this.spawnObstacle,
            callbackScope: this,
            loop: true
        });
        
    }

    spawnObstacle() {
        const obstacleX = this.sys.game.config.width;
        const obstacleY = this.ground.y - this.ground.height / 2 - 50;
        const obstacle = this.physics.add.sprite(obstacleX, obstacleY, 'obstacle');
        obstacle.setVelocityX(gameOptions.obstacleSpeed * -1);
        this.obstacleGroup.add(obstacle);
    }

    update() {
        // Check for collision with obstacles
        this.physics.world.collide(this.player, this.obstacleGroup, this.gameOver, null, this);

    }

    gameOver() {
        // Stop the game and display the game over screen
        this.physics.pause();
        this.bgm.stop();
        this.scene.start('gameOverScene');
    }
}