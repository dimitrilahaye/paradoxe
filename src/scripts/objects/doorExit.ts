export default class DoorExit extends Phaser.Physics.Arcade.Sprite {
	constructor(scene: Phaser.Scene, x: number, y: number) {
    	super(scene, x, y, 'door_end_open');
    	scene.add.existing(this);
	}
    
	// create() {
	// }

	// update() {
	// }

	public open(): void {
		this.setTexture('door_end_open');
		this.scene.sound.play('door_open');
	}

	public close(): void {
		this.setTexture('door_end_close');
		this.scene.sound.play('door_close');
	}
}
