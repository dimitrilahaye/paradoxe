export default class ExitButton extends Phaser.Physics.Arcade.Sprite {
	private nextActivability = 0;
	private activabilityRate = 500;
	
	constructor(scene: Phaser.Scene, x: number, y: number) {
    	super(scene, x, y, 'exit');
    	scene.add.existing(this);
		this.setInteractive();
		this.setScale(0.5);
		this.create();
	}
    
	create() {
		this.on('pointerdown', () => {
			this.activate();
		});
		this.on('pointerover', () => {
			this.scene.sys.canvas.style.cursor = 'pointer';
		});
		this.on('pointerout', () => {
			this.scene.sys.canvas.style.cursor = 'default';
		});
	}

	// update() {
	// }

	private activate(): void {
		if (this.scene.time.now > this.nextActivability) {
			this.nextActivability = this.scene.time.now + this.activabilityRate;
    		this.scene.events.emit('ExitButton::exit');
		}
	}
}
