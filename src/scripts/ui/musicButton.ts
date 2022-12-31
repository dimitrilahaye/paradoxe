export default class MusicButton extends Phaser.Physics.Arcade.Sprite {
	private nextActivability = 0;
	private activabilityRate = 500;
	
	constructor(scene: Phaser.Scene, x: number, y: number) {
		const hasMusic = scene.store.get<boolean>('music');
    	super(scene, x, y, hasMusic ? 'music_on' : 'music_off');
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
			const hasMusic = this.scene.store.get<boolean>('music');
			this.scene.store.set('music', !hasMusic);
			if (!hasMusic) {
				this.setTexture('music_on');
			}
			if (hasMusic) {
				this.setTexture('music_off');
			}
			const hasFx = this.scene.store.get<boolean>('fx');
			if (hasFx) {
				this.scene.sound.play('switcher');
			}
		}
	}
}
