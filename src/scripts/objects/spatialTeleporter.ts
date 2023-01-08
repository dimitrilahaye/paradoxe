import frameRate from '../decorators/frameRate';

export default class SpatialTeleporter extends Phaser.Physics.Arcade.Sprite {
    private _nextTp = 0;
    private _tpRate = 500;
    private hasFx: boolean;
    protected oppositeSpatialTeleporter: SpatialTeleporter;

    get nextTp(): number {
    	return this._nextTp;
    }

    set nextTp(nextTp: number) {
    	this._nextTp = nextTp;
    }

    get tpRate(): number {
    	return this._tpRate;
    }
    
    constructor(
    	scene: Phaser.Scene,
    	x: number,
    	y: number,
    	key: string,
        private readonly group: number,
        private readonly num: number,
    ) {
    	super(scene, x, y, key);
    	scene.add.existing(this);
    	this.hasFx = this.scene.store.get<boolean>('fx') ?? true;
    	this.create();
    }

    create() {
    	this.scene.events.on('SpatialTeleporter::activate', (targetGroup: number, targetNum: number, nextTp: number) => {
    		if (this.num === targetNum && this.group === targetGroup) {
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

	@frameRate(500)
    public activate(): void {
    	const targetNum = this.num === 0 ? 1 : 0;
    	if (this.hasFx) {
    		this.scene.sound.play('door_tp');
    	}
    	this.scene.events.emit('SpatialTeleporter::activate', this.group, targetNum, this.nextTp);
    }
}
