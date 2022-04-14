import { Coordinates } from '../types';

export default abstract class SpatialTeleporter extends Phaser.Physics.Arcade.Sprite {
    private _nextTp = 0;
    private _tpRate = 500;
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
    
    constructor(scene: Phaser.Scene, x: number, y: number, key: string) {
    	super(scene, x, y, key);
    	scene.add.existing(this);
    }

    public setOpposite(opposite: SpatialTeleporter): void {
    	this.oppositeSpatialTeleporter = opposite;
    }

    protected getOppositeCoordinates(): Coordinates {
    	const { x, y } = this.oppositeSpatialTeleporter;
    	return { x, y };
    }

    // create() {
    // }

    // update() {
    // }

    public abstract activate(): void;
}
