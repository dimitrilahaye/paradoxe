/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as scenes from '../types';

export type Translations = {
	[scene: string]: {
		'fr': string[],
		'en': string[],
	}
}
export default class TranslatePlugin extends Phaser.Plugins.ScenePlugin {

	private lang: string;
	private translations: Translations;

	constructor (scene: Phaser.Scene, pluginManager: Phaser.Plugins.PluginManager) {
		super(scene, pluginManager, 'translate');
	}
	
	get(key: scenes.SceneKey, index: number): string {
		if (!this.translations) {
			this.translations = this.scene.cache.json.get('translations');
		}
		this.lang = this.scene.store.get<string>('lang') ?? 'fr';

		const translation = this.translations[key]?.[this.lang]?.[index];

		if (!translation) {
			throw new Error(`translation not found for key ${key} and index ${index}`);
		}
		
		return this.translations[key][this.lang][index];
	}

}