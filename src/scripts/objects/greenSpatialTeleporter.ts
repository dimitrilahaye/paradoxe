import SpatialTeleporter from './spatialTeleporter';

export default class GreenSpatialTeleporter extends SpatialTeleporter {
	constructor(scene: Phaser.Scene, x: number, y: number) {
    	super(scene, x, y, 'door_tp_green');
	}

	// create() {
	// }

	// update() {
	// }

	public activate(): void {
    	if (this.scene.time.now > this.nextTp) {
    		this.nextTp = this.oppositeSpatialTeleporter.nextTp = this.scene.time.now + this.tpRate;
    		this.scene.sound.play('door_tp');
    		this.scene.events.emit('GreenSpatialTeleporter::activate', this.getOppositeCoordinates());
    	}
	}
}
