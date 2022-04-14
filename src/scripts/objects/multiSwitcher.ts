export default class MultiSwitcher extends Phaser.Physics.Arcade.Sprite {
	private nextActivability = 0;
	private activabilityRate = 500;
	private num: number;
	constructor(scene: Phaser.Scene, x: number, y: number, num: number) {
    	super(scene, x, y, 'switcher_orange');
    	scene.add.existing(this);
		this.num = num;
	}
    
	// create() {
	// }

	// update() {
	// }

	public activate(): void {
		if (this.scene.time.now > this.nextActivability) {
			this.nextActivability = this.scene.time.now + this.activabilityRate;
    		this.scene.sound.play('switcher');
    		this.scene.events.emit('MultiSwitcher::activate', this.num);
		}
	}
}
