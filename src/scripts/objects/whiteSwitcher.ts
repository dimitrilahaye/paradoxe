export default class WhiteSwitcher extends Phaser.Physics.Arcade.Sprite {
	protected nextActivability = 0;
	protected activabilityRate = 500;
    protected isOn: boolean;
    private text: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, x: number, y: number, isOn: boolean, private readonly textContent) {
    	super(scene, x, y, isOn ? 'bool_white_on' : 'bool_white_off');
    	this.isOn = isOn;
    	scene.add.existing(this);
    }
    
    create() {
    	this.resolveState();
    }
	
    protected switch(): void {
    	this.isOn = !this.isOn;
    	this.resolveState();
    	const fxIsOn = this.scene.store.get<boolean>('fx');
    	if (fxIsOn) {
    		this.scene.sound.play('switcher');
    	}
    }

    private resolveState() {
    	if (this.text) {
    		this.text.destroy();
    	}
    	this.text = this.scene.add.text(Math.round(this.x), Math.round(this.y - 30), this.textContent, {
    		fontFamily: 'Pixels',
    		align: 'left', 
    	}).setScale(1).setFontSize(15).setResolution(10).setOrigin(0.5, 0.5);
    	if (this.isOn) {
    		this.text.setColor('blue').setAlpha(1);
    		this.setTexture('bool_white_on');
    	}
    	if (!this.isOn) {
    		this.text.setColor('red').setAlpha(0.2);
    		this.setTexture('bool_white_off');
    	}
    }

	// update() {
	// }
}
