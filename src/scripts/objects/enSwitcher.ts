import WhiteSwitcher from './whiteSwitcher';

export default class EnSwitcher extends WhiteSwitcher {
	constructor(scene: Phaser.Scene, x: number, y: number) {
		const isEn = scene.store.get<string>('lang');
		const isOn = isEn === null ? false : isEn === 'en';
    	super(scene, x, y, isOn, 'EN');
		this.create();
	}
    
	create() {
		super.create();
		this.scene.events.on('StartScreen::switchEn', () => {
			if (this.scene.time.now > this.nextActivability) {
				this.nextActivability = this.scene.time.now + this.activabilityRate;
				this.switch();
				this.scene.events.emit('StartScreen::switchFr');
				if (this.isOn) {
					this.scene.store.set('lang', 'en');
				}
			}
		}, this);
	}

	// update() {
	// }
}
