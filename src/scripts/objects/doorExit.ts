export default class DoorExit extends Phaser.Physics.Arcade.Sprite {
	private hasFx: boolean;
	
	constructor(scene: Phaser.Scene, x: number, y: number) {
    	super(scene, x, y, 'door_end_open');
    	scene.add.existing(this);
		this.hasFx = this.scene.store.get<boolean>('fx') ?? true;
	}
    
	// create() {
	// }

	// update() {
	// }

	public open(): void {
		this.setTexture('door_end_open');
		if (this.hasFx) {
			this.scene.sound.play('door_open');
		}
	}

	public close(): void {
		this.setTexture('door_end_close');
		if (this.hasFx) {
			this.scene.sound.play('door_close');
		}
	}
}
