import frameRate from '../decorators/frameRate';
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
			this.activate();
		}, this);
	}
	
	@frameRate(500)
	activate(): void {
		this.switch();
		this.scene.events.emit('StartScreen::switchFr');
		if (this.isOn) {
			this.scene.store.set('lang', 'en');
		}
	}

	// update() {
	// }
}
