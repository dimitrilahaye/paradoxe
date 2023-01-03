import { LayerName } from '../objects';
import { Coordinates } from '../types';

export default class UtilsPlugin extends Phaser.Plugins.ScenePlugin {
	private tilemap: Phaser.Tilemaps.Tilemap;

	constructor (scene: Phaser.Scene, pluginManager: Phaser.Plugins.PluginManager) {
		super(scene, pluginManager, 'utils');
	}

	init(tilemap: Phaser.Tilemaps.Tilemap): void {
    	this.tilemap = tilemap;
	}

	filterObjectsByLayerAndProperties(layer: LayerName, properties: { [key: string]: any }): Phaser.Types.Tilemaps.TiledObject[] {
    	const objects = this.tilemap.filterObjects(layer, (obj) => {
    		const objectProperties = this.getPropertiesAsObject(obj as unknown as Phaser.Types.Tilemaps.TiledObject);
    		if (!objectProperties) {
    			return false;
    		}
    		return Object.keys(properties).every((k) => objectProperties[k] === properties[k]);
    	});
    	if (!objects) {
    		throw new Error(`Objects with properties ${JSON.stringify(properties)} not found in layer ${layer}`);
    	}
    	return objects;
	}

	findObjectByLayerAndName(layer: LayerName, name: string): Phaser.Types.Tilemaps.TiledObject {
    	const object = this.tilemap.findObject(layer, (obj) => {
    		return obj.name === name;
    	});
    	if (!object) {
    		throw new Error(`Object with name ${name} not found in layer ${layer}`);
    	}
    	return object;
	}

	filterObjectsByLayerAndName(layer: LayerName, name: string): Phaser.Types.Tilemaps.TiledObject[] {
    	const objects = this.tilemap.filterObjects(layer, (obj) => {
    		return obj.name === name;
    	});
    	if (!objects) {
    		throw new Error(`Objects with name ${name} not found in layer ${layer}`);
    	}
    	return objects;
	}

	getPropertiesAsObject(obj: Phaser.Types.Tilemaps.TiledObject) {
    	if (!obj.properties) {
    		return null;
    	}
    	return obj.properties.reduce((o, prop) => {
    		return {
    			...o,
    			[prop.name]: prop.value,
    		};
    	}, {});
	}

	coordinatesAreNear(coordinatesA: Coordinates, coordinatesB: Coordinates, offset = 10) {
    	const dx = coordinatesA.x - coordinatesB.x;
    	const dy = coordinatesA.y - coordinatesB.y;
    	const distance = Math.sqrt(dx * dx + dy * dy);

    	return Math.abs(distance) < offset;
	}

	findObjectOnGroupByData<T>(group: Phaser.GameObjects.Group, data: { [key: string]: any }): T | undefined {
    	if (group?.getLength() > 0) {
    		return group.children.getArray().find((child) => {
    			return Object.keys(data).every((d) => child.getData(d) === data[d]);
    		}) as unknown as T;
    	}
    	throw new Error(`Object not found with data ${JSON.stringify(data)}`);
	}

	iterateOnGroup(group: Phaser.GameObjects.Group, callback: (object, index?: number) => void) {
    	if (group?.getLength() > 0) {
    		group.children.iterate(callback);
    	}
	}

	findObjectOnGroup(group: Phaser.GameObjects.Group, callback: (pastPlayer: Phaser.GameObjects.GameObject) => void) {
    	if (group?.getLength() > 0) {
    		return group.children.getArray().find(callback);
    	}
    	return false;
	}

	intersectObjects(obj1: Phaser.GameObjects.Sprite, obj2: Phaser.GameObjects.Sprite): boolean {
    	const RectangleToRectangle = Phaser.Geom.Intersects.RectangleToRectangle;

    	return RectangleToRectangle(obj1.getBounds(), obj2.getBounds());
	}

	findObjectByLayerAndProperties(layer: LayerName, properties: { [key: string]: any }): Phaser.Types.Tilemaps.TiledObject {
    	const object = this.tilemap.findObject(layer, (obj) => {
    		const objectProperties = this.getPropertiesAsObject(obj as unknown as Phaser.Types.Tilemaps.TiledObject);
    		return Object.keys(properties).every((k) => objectProperties[k] === properties[k]);
    	});
    	if (!object) {
    		throw new Error(`Object with properties ${JSON.stringify(properties)} not found in layer ${layer}`);
    	}
    	return object;
	}

	getMiddleSceneCoordinates(): { x: number, y: number } {
    	const x = this.scene.cameras.main.worldView.x + this.scene.cameras.main.width / 2;
    	const y = this.scene.cameras.main.worldView.y + this.scene.cameras.main.height / 2;

    	return { x, y };
	}

	shakeOnTpCollision(): void {
    	this.scene.cameras.main.shake(50, 0.01);
	}
}
