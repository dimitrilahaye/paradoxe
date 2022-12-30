export default class StartNewGame extends Phaser.Physics.Arcade.Sprite {
	constructor(scene: Phaser.Scene, x: number, y: number) {
    	super(scene, x, y, 'door_start');
    	this.setInteractive();
    	scene.add.existing(this);
		this.create();
	}
    
	create() {
		this.scene.add.text(
			Math.round(this.x),
			Math.round(this.y - 30),
			'NEW GAME',
			{
				fontFamily: 'Pixels',
				align: 'left',
			}).setScale(1).setFontSize(15).setResolution(10).setOrigin(0.5, 0.5).setColor('blue');

    	this.on('pointerdown', () => {
    		this.scene.events.emit('StartNewGame::go');
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
}
