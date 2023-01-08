import { Coordinates } from '../types';

export default class DoubleTimeTeleporter extends Phaser.Physics.Arcade.Sprite {
	private oppositeDoubleTimeTeleporter: DoubleTimeTeleporter;
	private alive = true;
	private hasFx: boolean;
    
	constructor(scene: Phaser.Scene, x: number, y: number, public readonly group: number, public readonly num: number) {
    	super(scene, x, y, 'tp_red');
    	scene.add.existing(this);
    	this.scene.physics.world.enable(this);
    	this.setImmovable(true);
		this.hasFx = this.scene.store.get<boolean>('fx') ?? true;
    	this.create();
	}
    
	create() {
    	this.scene.events.on('DoubleSwitcher::activate', (group: number) => {
    		this.switch(group);
    	});
		this.scene.events.on('Store::fx', (isOn) => {
			this.hasFx = isOn;
		});
	}
	
	private switch(group: number) {
		if (this.group === group) {
			if (this.alive) {
				this.alive = false;
				this.setTexture('tp_red_close');
				this.scene.events.emit('DoubleTimeTeleporter::isClosed', this);
			} else {
				this.alive = true;
				this.setTexture('tp_red');
				this.scene.events.emit('DoubleTimeTeleporter::isOpen', this);
			}
		}
	}

	// update() {
	// }
    
	public addOpposite(opposite: DoubleTimeTeleporter): void {
    	this.oppositeDoubleTimeTeleporter = opposite;
	}

	public activate(): void {
		if (this.hasFx) {
    		this.scene.sound.play('tp');
		}
    	this.scene.events.emit('DoubleTimeTeleporter::activate', { x: this.x, y: this.y }, this.getOppositeCoordinates());
	}
    
	private getOppositeCoordinates(): Coordinates {
    	const { x, y } = this.oppositeDoubleTimeTeleporter;
    	return { x, y };
	}
}
