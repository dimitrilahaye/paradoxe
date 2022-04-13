import { Coordinates } from '../types';

export default class DoubleTimeTeleporter extends Phaser.Physics.Arcade.Sprite {
    private oppositeDoubleTimeTeleporter: DoubleTimeTeleporter;
    
    constructor(scene: Phaser.Scene, x: number, y: number) {
    	super(scene, x, y, 'tp_red');
    	scene.add.existing(this);
    	this.scene.physics.world.enable(this);
    	this.setImmovable(true);
    }
    
    public setOpposite(opposite: DoubleTimeTeleporter): void {
    	this.oppositeDoubleTimeTeleporter = opposite;
    }
    
    private getOppositeCoordinates(): Coordinates {
    	const { x, y } = this.oppositeDoubleTimeTeleporter;
    	return { x, y };
    }
    
    // create() {
    // }

    // update() {
    // }

    public activate(): void {
    	this.scene.sound.play('tp');
    	this.scene.events.emit('DoubleTimeTeleporter::activate', {x: this.x, y: this.y }, this.getOppositeCoordinates());
    }
}
