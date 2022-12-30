import SpatialTeleporter from './spatialTeleporter';

export default class RedSpatialTeleporter extends SpatialTeleporter {
	private hasFx: boolean;

	constructor(scene: Phaser.Scene, x: number, y: number, num: number) {
    	super(scene, x, y, 'door_tp_red', num);
		this.hasFx = this.scene.store.get<boolean>('fx') ?? true;
		this.create();
	}

	create() {
		this.scene.events.on('RedSpatialTeleporter::activate', (targetNum: number, nextTp: number) => {
			if (this.num === targetNum) {
				this.nextTp = nextTp;
				this.scene.events.emit('SpatialTeleporter::teleport', { x: this.x, y: this.y });
			}
		});
		this.scene.events.on('Store::fx', (isOn) => {
			this.hasFx = isOn;
		});
	}

	// update() {
	// }

	public activate(): void {
    	if (this.scene.time.now > this.nextTp) {
    		this.nextTp = this.scene.time.now + this.tpRate;
			const targetNum = this.num === 0 ? 1 : 0;
			if (this.hasFx) {
    			this.scene.sound.play('door_tp');
			}
    		this.scene.events.emit('RedSpatialTeleporter::activate', targetNum, this.nextTp);
    	}
	}
}
