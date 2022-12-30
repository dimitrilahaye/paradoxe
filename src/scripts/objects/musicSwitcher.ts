import WhiteSwitcher from './whiteSwitcher';

export default class MusicSwitcher extends WhiteSwitcher {
	constructor(scene: Phaser.Scene, x: number, y: number) {
		const musicIsOn = scene.store.get<boolean>('music');
    	super(scene, x, y, musicIsOn ?? true, 'MUSIC');
		this.create();
	}
    
	create() {
		super.create();
		this.scene.events.on('StartScreen::switchMusic', () => {
			if (this.scene.time.now > this.nextActivability) {
				this.nextActivability = this.scene.time.now + this.activabilityRate;
				this.activate();
			}
		}, this);
	}


	public activate(): void {
		this.switch();
		this.scene.store.set('music', this.isOn);
	}
	// update() {
	// }
}
