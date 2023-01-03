/* eslint-disable @typescript-eslint/no-explicit-any */
// global.d.ts
declare namespace Phaser {
    interface Scene {
      store: {
        set(key: string, data: any): void;
        get<T>(key: string): T | null;
        remove(key: string):void;
      };
      translate: {
        get(key: SceneKey, index: number): string;
      };
      utils: {
        init(tilemap: Phaser.Tilemaps.Tilemap): void;
        filterObjectsByLayerAndProperties(layer: LayerName, properties: { [key: string]: any }): Phaser.Types.Tilemaps.TiledObject[];
        findObjectByLayerAndName(layer: LayerName, name: string): Phaser.Types.Tilemaps.TiledObject;
        filterObjectsByLayerAndName(layer: LayerName, name: string): Phaser.Types.Tilemaps.TiledObject[];
        getPropertiesAsObject(obj: Phaser.Types.Tilemaps.TiledObject);
        coordinatesAreNear(coordinatesA: Coordinates, coordinatesB: Coordinates, offset = 10);
        findObjectOnGroupByData<T>(group: Phaser.GameObjects.Group, data: { [key: string]: any }): T | undefined;
        iterateOnGroup(group: Phaser.GameObjects.Group, callback: (object, index?: number) => void);
        findObjectOnGroup(group: Phaser.GameObjects.Group, callback: (pastPlayer: Phaser.GameObjects.GameObject) => void);
        intersectObjects(obj1: Phaser.GameObjects.Sprite, obj2: Phaser.GameObjects.Sprite): boolean;
        findObjectByLayerAndProperties(layer: LayerName, properties: { [key: string]: any }): Phaser.Types.Tilemaps.TiledObject;
        getMiddleSceneCoordinates(): { x: number, y: number };
        shakeOnTpCollision(): void;
      };
    }
  }