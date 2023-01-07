import frameRate from '../decorators/frameRate';
import WhiteSwitcher from './whiteSwitcher';

export default class FrSwitcher extends WhiteSwitcher {
	constructor(scene: Phaser.Scene, x: number, y: number) {
		const isFr = scene.store.get<string>('lang');
		const isOn = isFr === null ? true : isFr === 'fr';
    	super(scene, x, y, isOn, 'FR');
		this.create();
	}
    
	create() {
		super.create();
		this.scene.events.on('StartScreen::switchFr', () => {
			this.activate();
		}, this);
	}
	
	@frameRate(500)
	activate(): void {
		this.switch();
		this.scene.events.emit('StartScreen::switchEn');
		if (this.isOn) {
			this.scene.store.set('lang', 'fr');
		}
	}

	// update() {
	// }
}
