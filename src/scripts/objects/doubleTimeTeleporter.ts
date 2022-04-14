import { Coordinates } from '../types';

export default class DoubleTimeTeleporter extends Phaser.Physics.Arcade.Sprite {
	private collidersGroup: Phaser.Physics.Arcade.Collider[] = [];
	private oppositeDoubleTimeTeleporter: DoubleTimeTeleporter;
	private alive = true;
    
	constructor(scene: Phaser.Scene, x: number, y: number) {
    	super(scene, x, y, 'tp_red');
    	scene.add.existing(this);
    	this.scene.physics.world.enable(this);
    	this.setImmovable(true);
    	this.create();
	}
    
	create() {
    	this.scene.events.on('DoubleSwitcher::activate', () => {
    		if (this.alive) {
    			this.alive = false;
    			this.setTexture('tp_red_close');
    			this.collidersGroup.forEach((collider) => this.scene.physics.world.removeCollider(collider));
    		}
    	});
	}
	
	// update() {
	// }
	
	public addCollider(...collider: Phaser.Physics.Arcade.Collider[]) {
    	this.collidersGroup.push(...collider);
	}
    
	public setOpposite(opposite: DoubleTimeTeleporter): void {
    	this.oppositeDoubleTimeTeleporter = opposite;
	}


	public activate(): void {
    	this.scene.sound.play('tp');
    	this.scene.events.emit('DoubleTimeTeleporter::activate', {x: this.x, y: this.y }, this.getOppositeCoordinates());
	}
    
	private getOppositeCoordinates(): Coordinates {
    	const { x, y } = this.oppositeDoubleTimeTeleporter;
    	return { x, y };
	}
}
