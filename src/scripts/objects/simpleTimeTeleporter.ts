export default class SimpleTimeTeleporter extends Phaser.Physics.Arcade.Sprite {
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
    			this.destroy();
    			this.alive = false;
    		}
    	});
    }

    // update() {
    // }

    public activate(): void {
    	this.scene.sound.play('tp');
    	this.scene.events.emit('SimpleTimeTeleporter::activate', {x: this.x, y: this.y });
    }
}
