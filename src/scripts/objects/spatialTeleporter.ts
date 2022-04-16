export default abstract class SpatialTeleporter extends Phaser.Physics.Arcade.Sprite {
    private _nextTp = 0;
    private _tpRate = 500;
    protected oppositeSpatialTeleporter: SpatialTeleporter;
    protected num: number;

    get nextTp(): number {
    	return this._nextTp;
    }

    set nextTp(nextTp: number) {
    	this._nextTp = nextTp;
    }

    get tpRate(): number {
    	return this._tpRate;
    }
    
    constructor(scene: Phaser.Scene, x: number, y: number, key: string, num: number) {
    	super(scene, x, y, key);
    	scene.add.existing(this);
    	this.num = num;
    }

    // create() {
    // }

    // update() {
    // }

    public abstract activate(): void;
}
