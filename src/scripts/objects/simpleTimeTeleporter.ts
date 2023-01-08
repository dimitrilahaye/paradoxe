export default class SimpleTimeTeleporter extends Phaser.Physics.Arcade.Sprite {
    private alive = true;
	private hasFx: boolean;

	constructor(scene: Phaser.Scene, x: number, y: number, public readonly group) {
    	super(scene, x, y, 'tp_green');
    	scene.add.existing(this);
    	this.scene.physics.world.enable(this);
    	this.setImmovable(true);
		this.hasFx = this.scene.store.get<boolean>('fx') ?? true;
    	this.create();
	}
    
	create() {
    	this.scene.events.on('SimpleSwitcher::activate', (group: number) => {
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
				this.setTexture('tp_green_close');
				this.scene.events.emit('SimpleTimeTeleporter::::isClosed', this);
			} else {
				this.alive = true;
				this.setTexture('tp_green');
				this.scene.events.emit('SimpleTimeTeleporter::isOpen', this);
			}
		}
	}

	public activate(): void {
		if (this.hasFx) {
    		this.scene.sound.play('tp');
		}
    	this.scene.events.emit('SimpleTimeTeleporter::activate', { x: this.x, y: this.y });
	}
}
