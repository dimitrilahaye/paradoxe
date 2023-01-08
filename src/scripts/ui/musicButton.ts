import frameRate from '../decorators/frameRate';
import { Depth } from '../types';

export default class MusicButton extends Phaser.Physics.Arcade.Sprite {
	constructor(scene: Phaser.Scene, x: number, y: number) {
		const hasMusic = scene.store.get<boolean>('music');
    	super(scene, x, y, hasMusic ? 'music_on' : 'music_off');
    	scene.add.existing(this);
		this.setInteractive();
		this.setScrollFactor(0);
		this.setScale(0.5);
		this.setDepth(Depth.UI);
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
