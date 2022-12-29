import WhiteSwitcher from './whiteSwitcher';

export default class SoundSwitcher extends WhiteSwitcher {
	constructor(scene: Phaser.Scene, x: number, y: number) {
		const fxIsOn = scene.store.get<boolean>('fx');
    	super(scene, x, y, fxIsOn ?? true, 'FX');
		this.create();
	}
    
	create() {
		super.create();
		this.scene.events.on('StartScreen::switchFx', () => {
			if (this.scene.time.now > this.nextActivability) {
				this.nextActivability = this.scene.time.now + this.activabilityRate;
				this.switch();
				this.scene.store.set('fx', this.isOn);
				this.scene.events.emit('SoundSwitcher::fx', this.isOn);
			}
		});
	}

	// update() {
	// }
}
