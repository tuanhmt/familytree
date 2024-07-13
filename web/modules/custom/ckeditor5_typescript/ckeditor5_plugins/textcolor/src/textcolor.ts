import type { PluginInterface } from '@ckeditor/ckeditor5-core/src/plugin';
import type { PluginDependencies } from 'ckeditor5/src/core';
import { Plugin } from 'ckeditor5/src/core';
import TextColorUI from './testcolorui';
import TextColorEditing from './textcolorediting';

export default class TextColor extends Plugin implements PluginInterface {
	public static get requires(): PluginDependencies {
		return [TextColorEditing, TextColorUI] as const;
	}
}