import frameRate from '../decorators/frameRate';

export default class ResetButton extends Phaser.Physics.Arcade.Sprite {
	constructor(scene: Phaser.Scene, x: number, y: number) {
    	super(scene, x, y, 'reset');
    	scene.add.existing(this);
		this.setInteractive();
		this.setScrollFactor(0);
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

	@frameRate(500)
	private activate(): void {
		this.scene.events.emit('ResetButton::reset');
		const hasFx = this.scene.store.get<boolean>('fx');
		if (hasFx) {
			this.scene.sound.play('switcher');
		}
	}
}
