class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, velocity) {
        // call Phaser Physics Sprite constructor
        super(scene, game.config.width + obstacleWidth, Phaser.Math.Between(obstacleHeight/2, game.config.height - obstacleHeight/2), 'obstacle'); 
        
        this.parentScene = scene;               // maintain scene context

        // set up physics sprite
        this.parentScene.add.existing(this);    // add to existing scene, displayList, updateList
        this.parentScene.physics.add.existing(this);    // add to physics system
        this.setVelocityX(velocity);            // make it go!
        this.setImmovable();                    
        this.tint = Math.random() * 0xFFFFFF;   // randomize tint
        this.newPlayer = true;                 // custom property to control Player spawning
    }

    update() {
        // add new Player when existing Player hits center X
        if(this.newPlayer && this.x < centerX) {
            // (recursively) call parent scene method from this context
            this.parentScene.addPlayer(this.parent, this.velocity);
            this.newPlayer = false;
        }

        // destroy obstacle if it reaches the left edge of the screen
        if(this.x < -this.width) {
            this.destroy();
        }
    }
}