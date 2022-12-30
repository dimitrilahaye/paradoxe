// todo ActivableButton abstract class
// todo Store:: events instead of switchers...

export default class FxButton extends Phaser.Physics.Arcade.Sprite {
	private nextActivability = 0;
	private activabilityRate = 500;
	
	constructor(scene: Phaser.Scene, x: number, y: number) {
		const hasFx = scene.store.get<boolean>('fx');
    	super(scene, x, y, hasFx ? 'audio_on' : 'audio_off');
    	scene.add.existing(this);
		this.setInteractive();
		this.setScale(0.5);
		this.create();
	}
    
	create() {
		this.on('pointerdown', () => {
			this.activate();
		});
		this.on('pointerover', () => {
			this.scene.sys.canvas.style.cursor = 'pointer';
		});
		this.on('pointerout', () => {
			this.scene.sys.canvas.style.cursor = 'default';
		});
	}

	// update() {
	// }

	private activate(): void {
		if (this.scene.time.now > this.nextActivability) {
			this.nextActivability = this.scene.time.now + this.activabilityRate;
			const hasFx = this.scene.store.get<boolean>('fx');
			this.scene.store.set('fx', !hasFx);
			if (!hasFx) {
				this.setTexture('audio_on');
			}
			if (hasFx) {
				this.setTexture('audio_off');
			}
		}
	}
}
