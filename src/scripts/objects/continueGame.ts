import { SceneKey } from '../types';
export default class ContinueGame extends Phaser.Physics.Arcade.Sprite {
	private _isOpen: boolean;
	private hasFx: boolean;

	constructor(scene: Phaser.Scene, x: number, y: number) {
		const level = scene.store.get<SceneKey>('level');
    	super(scene, x, y, level ? 'door_start' : 'door_end_close');
    	this.setInteractive();
    	scene.add.existing(this);
		this._isOpen = level !== null;
		this.hasFx = this.scene.store.get<boolean>('fx') ?? true;
		this.create();
	}

	get isOpen(): boolean {
		return this._isOpen;
	}
    
	create() {
		this.scene.events.on('Store::fx', (isOn) => {
			this.hasFx = isOn;
		});
		this.scene.add.text(
			Math.round(this.x),
			Math.round(this.y - 30),
			'CONTINUE',
			{
				fontFamily: 'Pixels',
				align: 'left',
			}).setScale(1).setFontSize(15).setResolution(10).setOrigin(0.5, 0.5).setColor('blue');

    	this.on('pointerdown', () => {
			if (!this._isOpen && this.hasFx) {
				this.scene.sound.play('door_close');
				return;
			}
    		this.scene.events.emit('ContinueGame::go');
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
}
