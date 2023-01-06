export default class SimpleSwitcher extends Phaser.Physics.Arcade.Sprite {
	private nextActivability = 0;
	private activabilityRate = 500;
	private hasFx: boolean;
	
	constructor(scene: Phaser.Scene, x: number, y: number, public readonly group: number, public readonly num: number) {
    	super(scene, x, y, 'switcher_green');
    	scene.add.existing(this);
		this.hasFx = this.scene.store.get<boolean>('fx') ?? true;
		this.create();
	}
    
	create() {
		this.scene.events.on('Store::fx', (isOn) => {
			this.hasFx = isOn;
		});
	}

	// update() {
	// }

	public activate(): void {
		if (this.scene.time.now > this.nextActivability) {
			this.nextActivability = this.scene.time.now + this.activabilityRate;
			if (this.hasFx) {
    			this.scene.sound.play('switcher');
			}
    		this.scene.events.emit('SimpleSwitcher::activate', this.group);
		}
	}
}
