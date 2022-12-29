export default class DoubleSwitcher extends Phaser.Physics.Arcade.Sprite {
	private nextActivability = 0;
	private activabilityRate = 500;
	private hasFx: boolean;

	constructor(scene: Phaser.Scene, x: number, y: number) {
    	super(scene, x, y, 'switcher_red');
    	scene.add.existing(this);
		this.hasFx = this.scene.store.get<boolean>('fx') ?? true;
	}
    
	// create() {
	// }

	// update() {
	// }

	public activate(): void {
		if (this.scene.time.now > this.nextActivability) {
			this.nextActivability = this.scene.time.now + this.activabilityRate;
			if (this.hasFx) {
    			this.scene.sound.play('switcher');
			}
    		this.scene.events.emit('DoubleSwitcher::activate');
		}
	}
}
