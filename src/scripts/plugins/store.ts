/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-explicit-any */
export default class StorePlugin extends Phaser.Plugins.ScenePlugin {

	private prefix = 'paradoxe-game.'

	constructor (scene: Phaser.Scene, pluginManager: Phaser.Plugins.PluginManager) {
		super(scene, pluginManager, 'store');
	}

	set(key: string, data: any): void {
		localStorage.setItem(this.prefix+key,JSON.stringify(data));
	}

	get<T>(key: string): T | null {
		const data = localStorage.getItem(this.prefix+key);
		if (!data) {
			return null;
		}

		return JSON.parse(data) as T;
	}

}