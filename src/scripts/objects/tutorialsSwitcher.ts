import frameRate from '../decorators/frameRate';
import WhiteSwitcher from './whiteSwitcher';

export default class TutorialsSwitcher extends WhiteSwitcher {
	constructor(scene: Phaser.Scene, x: number, y: number) {
		const tutorialsIsOn = scene.store.get<boolean>('tutorials');
    	super(scene, x, y, tutorialsIsOn ?? true, 'TUTORIALS');
		this.create();
	}
    
	create() {
		super.create();
		this.scene.events.on('StartScreen::switchTutorials', () => {
			this.activate();
		}, this);
	}
	
	@frameRate(500)
	activate(): void {
		this.switch();
		this.scene.store.set('tutorials', this.isOn);
		this.scene.events.emit('TutorialsSwitcher::tutorials', this.isOn);
	}

	// update() {
	// }
}
