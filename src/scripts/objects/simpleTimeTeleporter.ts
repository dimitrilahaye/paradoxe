export default class SimpleTimeTeleporter extends Phaser.Physics.Arcade.Sprite {
	constructor(scene: Phaser.Scene, x: number, y: number) {
    	super(scene, x, y, 'tp_green');
    	scene.add.existing(this);
    	this.scene.physics.world.enable(this);
    	this.setImmovable(true);
	}
    
	// create() {
	// }

	// update() {
	// }

	public activate(): void {
    	this.scene.sound.play('tp');
    	this.scene.events.emit('SimpleTimeTeleporter::activate', {x: this.x, y: this.y });
	}
}
