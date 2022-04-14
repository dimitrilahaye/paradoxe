import { Coordinates } from '../types';

export default class MultiTimeTeleporter extends Phaser.Physics.Arcade.Sprite {
	private collidersGroup: Phaser.Physics.Arcade.Collider[] = [];
    private oppositeMultiTimeTeleporters: MultiTimeTeleporter[] = [];
	private _num: number;
    private _alive = true;

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
    	this.create();
    }
    
    // TODO: sur les deux opposites, les deux peuvent être fermés
    // TODO: donc si les deux sont fermés, on ouvre le 0
    // TODO: si le 0 est fermé on prend le 1 et vis versa
    // TODO: mettre à jour dans les 3 au fur et à mesure...
    create() {
    	this.scene.events.on('MultiSwitcher::activate', (num: number) => {
    		if (num === this.num) {
    			console.info('MultiSwitcher::activate', this.num);
    			const openOppositeFindIndex = this.oppositeMultiTimeTeleporters.findIndex((teleporter) => teleporter.alive);
    			const closedOppositeIndex = openOppositeFindIndex < 0 ? 0 : openOppositeFindIndex;
    			const openOppositeIndex = closedOppositeIndex === 0 ? 1 : 0;
    			const oppositeToClose = this.oppositeMultiTimeTeleporters[closedOppositeIndex];
    			const oppositeToOpen = this.oppositeMultiTimeTeleporters[openOppositeIndex];
				
    			this.scene.events.emit('MultiTimeTeleporter::closeOpposite', oppositeToClose.num);
    			this.scene.events.emit('MultiTimeTeleporter::openOpposite', oppositeToOpen.num);
    			if (!this.alive) {
    				this.scene.events.emit('MultiTimeTeleporter::openOpposite', this.num);
    			}
    		}
    	});

    	this.scene.events.on('MultiTimeTeleporter::closeOpposite', (num: number) => {
    		if (num === this.num) {
    			console.info('MultiTimeTeleporter::closeOpposite', this.num);
    			this.setToClose();
    		}
    	});
		
    	this.scene.events.on('MultiTimeTeleporter::openOpposite', (num: number) => {
    		if (num === this.num) {
    			console.info('MultiTimeTeleporter::openOpposite', this.num);
    			this.setToOpen();
    		}
    	});
    }
	
    // update() {
    // }
	
    public setToOpen() {
    	console.info('set to open', this.num);
    	this.alive = true;
    	this.setTexture('tp_orange');
    	this.scene.events.emit('MultiTimeTeleporter::setToOpen', this.num);
    }
	
    public setToClose() {
    	console.info('set to close', this.num);
    	this.alive = false;
    	this.setTexture('tp_orange_close');
    	this.collidersGroup.filter((collider) => collider.active).forEach((collider) => collider.destroy());
    }
	
    public addColliders(...collider: Phaser.Physics.Arcade.Collider[]) {
    	this.collidersGroup.push(...collider);
    }
    
    public setOpposites(...opposites: MultiTimeTeleporter[]): void {
    	this.oppositeMultiTimeTeleporters.push(...opposites);
    }


    public activate(): void {
    	this.scene.sound.play('tp');
    	this.scene.events.emit('DoubleTimeTeleporter::activate', {x: this.x, y: this.y }, this.getOppositeCoordinates());
    }
    
    private getOppositeCoordinates(): Coordinates {
    	const aliveTeleporter = this.oppositeMultiTimeTeleporters.find((teleporter) => teleporter.alive);
    	const targetTeleporter = aliveTeleporter ? aliveTeleporter : this.oppositeMultiTimeTeleporters[0];
    	const { x, y } = targetTeleporter;
    	return { x, y };
    }
}
