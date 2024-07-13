/**
 * The textcolor option descriptor. See {@link module:textcolor/textcolorconfig~TextColorConfig} to learn more.
 */
export interface TextColorOption {
	title: string;
	model: string;
	color: string;
	class: string;
}

/**
 * The configuration of the {@link module:textcolor/textcolor~Textcolor textcolor feature}.
 * See {@link module:core/editor/editorconfig~EditorConfig all editor options}.
 */
export interface TextColorConfig {
	options: Array<TextColorOption>;
}