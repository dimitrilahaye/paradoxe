import frameRate from '../decorators/frameRate';

/* eslint-disable @typescript-eslint/no-non-null-assertion */
export default class DoubleSwitcher extends Phaser.Physics.Arcade.Sprite {
	private hasFx: boolean;

	constructor(scene: Phaser.Scene, x: number, y: number, public readonly group: number, public readonly num: number) {
    	super(scene, x, y, 'switcher_red');
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

	@frameRate(500)
	public activate(): void {
		if (this.hasFx) {
    			this.scene.sound.play('switcher');
		}
		this.scene.events.emit('DoubleSwitcher::activate', this.group);
	}
}
