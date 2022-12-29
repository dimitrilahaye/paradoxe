import { Coordinates } from '../types';

export default class MultiTimeTeleporter extends Phaser.Physics.Arcade.Sprite {
	private collidersGroup: Phaser.Physics.Arcade.Collider[] = [];
	private oppositeMultiTimeTeleporters: MultiTimeTeleporter[] = [];
	private _num: number;
	private _alive = true;
	private hasFx: boolean;

	get alive(): boolean {
    	return this._alive;
	}
	set alive(alive: boolean) {
    	this._alive = alive;
	}
    
	get num(): number {
    	return this._num;
	}
	set num(num: number) {
    	this._num = num;
	}
    
	constructor(scene: Phaser.Scene, x: number, y: number, num: number) {
    	super(scene, x, y, 'tp_orange');
    	scene.add.existing(this);
    	this.scene.physics.world.enable(this);
    	this.setImmovable(true);
    	this.num = num;
		this.hasFx = this.scene.store.get<boolean>('fx') ?? true;
    	this.create();
	}
    
	create() {
    	this.scene.events.on('MultiSwitcher::activate', (num: number) => {
    		if (num === this.num) {
				
				const firstOpenedOpposite = this.oppositeMultiTimeTeleporters.find((teleporter) => teleporter.alive);
    			const firstClosedOpposite = this.oppositeMultiTimeTeleporters.find((teleporter) => !teleporter.alive);
				
				if (firstOpenedOpposite) {
					firstOpenedOpposite.setToClose();
				}
				if (!this.alive) {
					this.setToOpen();
				} else if (firstClosedOpposite) {
					firstClosedOpposite.setToOpen();
				}
    			
				const firstOpposite = this.oppositeMultiTimeTeleporters.shift();
    			this.oppositeMultiTimeTeleporters.push(firstOpposite as MultiTimeTeleporter);
    		}
    	});
	}
	
	// update() {
	// }
	
	public setToOpen() {
    	this.alive = true;
    	this.setTexture('tp_orange');
    	this.scene.events.emit('MultiTimeTeleporter::setToOpen', this.num);
	}
	
	public setToClose() {
    	this.alive = false;
    	this.setTexture('tp_orange_close');
    	this.collidersGroup.filter((collider) => collider.active).forEach((collider) => collider.destroy());
	}
	
	public addColliders(...collider: Phaser.Physics.Arcade.Collider[]) {
    	this.collidersGroup.push(...collider);
	}
    
	public addOpposites(...opposites: MultiTimeTeleporter[]): void {
    	this.oppositeMultiTimeTeleporters.push(...opposites);
	}

	public activate(): void {
		if (this.hasFx) {
    		this.scene.sound.play('tp');
		}
    	this.scene.events.emit('DoubleTimeTeleporter::activate', { x: this.x, y: this.y }, this.getOppositeCoordinates());
	}
    
	private getOppositeCoordinates(): Coordinates {
    	const aliveTeleporter = this.oppositeMultiTimeTeleporters.find((teleporter) => teleporter.alive);
    	const targetTeleporter = aliveTeleporter ? aliveTeleporter : this.oppositeMultiTimeTeleporters[0];
    	const { x, y } = targetTeleporter;
    	return { x, y };
	}
}
