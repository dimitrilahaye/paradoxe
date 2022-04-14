import { Coordinates } from '../types';

export default class MultiTimeTeleporter extends Phaser.Physics.Arcade.Sprite {
	private collidersGroup: Phaser.Physics.Arcade.Collider[] = [];
    private oppositeMultiTimeTeleporters: MultiTimeTeleporter[] = [];
	private lastClosedOppositeIndex: number;
    private alive = true;
	private num: number;
    
	constructor(scene: Phaser.Scene, x: number, y: number, num: number) {
    	super(scene, x, y, 'tp_orange');
    	scene.add.existing(this);
    	this.scene.physics.world.enable(this);
    	this.setImmovable(true);
		this.num = num;
    	this.create();
	}
    
	create() {
    	this.scene.events.on('MultiSwitcher::activate', (num: number) => {
			if (num === this.num) {
				if (this.alive) {
					this.setToClose();
				} else {
					this.setToOpen();
				}
			}
    	});
	}
	
	// update() {
	// }
	
	public setToOpen() {
    	this.alive = true;
    	this.setTexture('tp_orange');
    	this.scene.events.emit('MultiTimeTeleporter::setToOpen');
	}

	public setToClose() {
    	this.alive = false;
    	this.setTexture('tp_orange_close');
    	this.collidersGroup.forEach((collider) => this.scene.physics.world.removeCollider(collider));
	}

	
	public addCollider(...collider: Phaser.Physics.Arcade.Collider[]) {
    	this.collidersGroup.push(...collider);
	}
    
	public setOpposites(...opposites: MultiTimeTeleporter[]): void {
    	this.oppositeMultiTimeTeleporters.push(...opposites);
	}


	public activate(): void {
    	this.scene.sound.play('tp');
    	this.scene.events.emit('DoubleTimeTeleporter::activate', {x: this.x, y: this.y }, this.getOppositeCoordinates());
	}
    
	// TODO: super logique, mais ça c'est pour savoir où on se téléporte
	// là ce qu'on veut c'est savoir quel portail doit fermer le switcher
	private getOppositeCoordinates(): Coordinates {
		if (!this.lastClosedOppositeIndex) {
			this.lastClosedOppositeIndex = 0;
		} else {
			this.lastClosedOppositeIndex = this.lastClosedOppositeIndex === 0 ? 1 : 0;
		}
    	const { x, y } = this.oppositeMultiTimeTeleporters[this.lastClosedOppositeIndex];
    	return { x, y };
	}
}
