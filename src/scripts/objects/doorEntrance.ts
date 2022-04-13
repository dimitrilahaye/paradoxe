export default class DoorEntrance extends Phaser.Physics.Arcade.Sprite {
	constructor(scene: Phaser.Scene, x: number, y: number) {
    	super(scene, x, y, 'door_start');
    	scene.add.existing(this);
	}
    
	// create() {
	// }

	// update() {
	// }
}
