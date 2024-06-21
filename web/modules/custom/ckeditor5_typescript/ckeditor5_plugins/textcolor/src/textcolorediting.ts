/**
 * @module textcolor/textcolorediting
 */

import { Plugin, type Editor } from 'ckeditor5/src/core';
import TextColorCommand from './textcolorcommand';
import { TextColorOption } from './textcolorconfig';


export default class TextColorEditing extends Plugin {
	/**
	 * @inheritDoc
	 */
	public static get pluginName() {
		return 'TextColorEditing' as const;
	}

	/**
	 * @inheritDoc
	 */
	constructor(editor: Editor) {
		super(editor);

		editor.config.define('textcolor', {
			options: [
				{
					model: 'yellowColor',
					class: 'color-yellow',
					title: 'Yellow',
					color: '#f3cb41',
				},
				{
					model: 'redColor',
					class: 'color-red',
					title: 'Red',
					color: 'red',
				},
				{
					model: 'blueColor',
					class: 'color-blue',
					title: 'Blue',
					color: 'blue'
				},
			]
		});
	}

	/**
	 * @inheritDoc
	 */
	public init(): void {
		const editor = this.editor;
		editor.model.schema.extend('$text', { allowAttributes: 'textcolor' });
		const options = editor.config.get('textcolor.options')!;
		editor.conversion.attributeToElement(_buildDefinition(options));
		editor.commands.add('textcolor', new TextColorCommand(editor));
	}
}

/**
 * Converts the options array to a converter definition.
 *
 * @param options An array with configured options.
 */
function _buildDefinition(options: Array<TextColorOption>): TextColorConverterDefinition {
	const definition: TextColorConverterDefinition = {
		model: {
			key: 'textcolor',
			values: []
		},
		view: {}
	};

	for (const option of options) {
		definition.model.values.push(option.model);
		definition.view[option.model] = {
			name: 'span',
			classes: option.class
		};
	}

	return definition;
}

type TextColorConverterDefinition = {
	model: { key: string; values: Array<string> };
	view: Record<string, { name: string; classes: string }>;
};