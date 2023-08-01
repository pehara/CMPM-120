class Explosion extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        // call Phaser Physics Sprite constructor
        super(scene, x, y, 'explosion'); 

        //Construct explosion and add to physics scene
        this.parentScene = scene
        this.parentScene.add.existing(this)
        this.parentScene.physics.add.existing(this)
        this.setImmovable(true)
        this.sx = x
        this.sy = y

        //destroy the explosion when it finishes animation

        this.on('animationcomplete', this.delete)
    }

    update(){
    }
    

    //deletes current explosion sprite
    delete(){
        this.destroy()
        this.parentScene.spawnFire(this.sx, this.sy)
    }
}