class Bomb extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y) {
		// call Phaser Physics Sprite constructor
		super(scene, x, y, 'bomb'); 

		//Construct bomb and add to physics scene
		this.parentScene = scene
		this.parentScene.add.existing(this)
		this.parentScene.physics.add.existing(this)
		this.setImmovable(true)
		this.spawnx = x
		this.spawny = y
	
		//destroy the bomb when it finishes animation

		this.on('animationcomplete', this.delete)

	}

	update(){
		//destroy the bomb when it finishes animation
	}
	

	//deletes current bomb sprite
	delete(){
		this.destroy()
		let explosion = new Explosion(this.parentScene, this.spawnx, this.spawny)
		explosion.play('explode')
		this.parentScene.explosionGroup.add(explosion)
	}
}