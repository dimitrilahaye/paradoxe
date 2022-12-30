export default class SimpleTimeTeleporter extends Phaser.Physics.Arcade.Sprite {
	private collidersGroup: Phaser.Physics.Arcade.Collider[] = [];
    private alive = true;
	private hasFx: boolean;

	constructor(scene: Phaser.Scene, x: number, y: number) {
    	super(scene, x, y, 'tp_green');
    	scene.add.existing(this);
    	this.scene.physics.world.enable(this);
    	this.setImmovable(true);
		this.hasFx = this.scene.store.get<boolean>('fx') ?? true;
    	this.create();
	}
    
	create() {
    	this.scene.events.on('SimpleSwitcher::activate', () => {
    		if (this.alive) {
    			this.alive = false;
    			this.setTexture('tp_green_close');
    			this.collidersGroup.forEach((collider) => this.scene.physics.world.removeCollider(collider));
    		}
    	});
		this.scene.events.on('Store::fx', (isOn) => {
			this.hasFx = isOn;
		});
	}
	
	public addColliders(...collider: Phaser.Physics.Arcade.Collider[]) {
    	this.collidersGroup.push(...collider);
	}

	public activate(): void {
		if (this.hasFx) {
    		this.scene.sound.play('tp');
		}
    	this.scene.events.emit('SimpleTimeTeleporter::activate', { x: this.x, y: this.y });
	}
}
