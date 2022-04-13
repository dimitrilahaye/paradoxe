export default class SpatialTeleporter extends Phaser.Physics.Arcade.Sprite {
    public nextTp = 0;
    private tpRate = 500;
    private oppositeSpatialTeleporter: SpatialTeleporter;
    
    constructor(scene: Phaser.Scene, x: number, y: number) {
    	super(scene, x, y, 'door_tp');
    	scene.add.existing(this);
    }

    public setOpposite(opposite: SpatialTeleporter): void {
    	this.oppositeSpatialTeleporter = opposite;
    }

    private getOppositeCoordinates(): { x: number, y: number } {
    	const { x, y } = this.oppositeSpatialTeleporter;
    	return { x, y };
    }

    // create() {
    // }

    // update() {
    // }

    public activate(): void {
    	if (this.scene.time.now > this.nextTp) {
    		this.nextTp = this.oppositeSpatialTeleporter.nextTp = this.scene.time.now + this.tpRate;
    		this.scene.sound.play('door_tp');
    		this.scene.events.emit('SpatialTeleporter::activate', this.getOppositeCoordinates());
    	}
    }
}
