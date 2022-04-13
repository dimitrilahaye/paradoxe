export default class DoubleSwitcher extends Phaser.Physics.Arcade.Sprite {
	private nextActivability = 0;
	private activabilityRate = 500;
	constructor(scene: Phaser.Scene, x: number, y: number) {
    	super(scene, x, y, 'switcher_red');
    	scene.add.existing(this);
	}
    
	// create() {
	// }

	// update() {
	// }

	public activate(): void {
		if (this.scene.time.now > this.nextActivability) {
			this.nextActivability = this.scene.time.now + this.activabilityRate;
    		this.scene.sound.play('switcher');
    		this.scene.events.emit('DoubleSwitcher::activate');
		}
	}
}
