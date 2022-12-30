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
			if (this.scene.time.now > this.nextActivability) {
				this.nextActivability = this.scene.time.now + this.activabilityRate;
				this.switch();
				this.scene.store.set('tutorials', this.isOn);
				this.scene.events.emit('TutorialsSwitcher::tutorials', this.isOn);
			}
		}, this);
	}

	// update() {
	// }
}
