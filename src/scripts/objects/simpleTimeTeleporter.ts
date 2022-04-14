export default class SimpleTimeTeleporter extends Phaser.Physics.Arcade.Sprite {
	private collidersGroup: Phaser.Physics.Arcade.Collider[] = [];
    private alive = true;

    constructor(scene: Phaser.Scene, x: number, y: number) {
    	super(scene, x, y, 'tp_green');
    	scene.add.existing(this);
    	this.scene.physics.world.enable(this);
    	this.setImmovable(true);
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
    }

    // update() {
    // }
	
    public addCollider(...collider: Phaser.Physics.Arcade.Collider[]) {
    	this.collidersGroup.push(...collider);
    }


    public activate(): void {
    	this.scene.sound.play('tp');
    	this.scene.events.emit('SimpleTimeTeleporter::activate', {x: this.x, y: this.y });
    }
}
