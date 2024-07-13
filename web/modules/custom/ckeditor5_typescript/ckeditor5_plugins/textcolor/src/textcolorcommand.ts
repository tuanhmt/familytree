import { TreeWalkerValue } from '@ckeditor/ckeditor5-engine';
import { Command } from 'ckeditor5/src/core';

export default class TextColorCommand extends Command {
  /**
	 * A value indicating whether the command is active. If the selection has some textcolor attribute,
	 * it corresponds to the value of that attribute.
	 *
	 * @observable
	 * @readonly
	 */
	declare public value: string | undefined;

	/**
   * @inheritDoc
   */
  public static get pluginName() {
    return 'TextColorCommand' as const;
  }

	/**
	 * @inheritDoc
	 */
	public override refresh(): void {
		const model = this.editor.model;
		const doc = model.document;

		this.value = doc.selection.getAttribute( 'textcolor' ) as string | undefined;
		this.isEnabled = model.schema.checkAttributeInSelection( doc.selection, 'textcolor' );
	}

  /**
	 * Executes the command.
	 *
	 * @param options Options for the executed command.
	 * @param options.value The value to apply.
	 *
	 * @fires execute
	 */
	public override execute( options: { value?: string | null } = {} ): void {
		const model = this.editor.model;
		const document = model.document;
		const selection = document.selection;

		const textcolorizer = options.value;

		model.change( writer => {
			if ( selection.isCollapsed ) {
				const position = selection.getFirstPosition()!;

				// When selection is inside text with `textcolor` attribute.
				if ( selection.hasAttribute( 'textcolor' ) ) {
					// Find the full textcolored range.
					const isSameTextColor = ( value: TreeWalkerValue ) => {
						return value.item.hasAttribute( 'textcolor' ) && value.item.getAttribute( 'textcolor' ) === this.value;
					};

					const textcolorStart = position.getLastMatchingPosition( isSameTextColor, { direction: 'backward' } );
					const textcolorEnd = position.getLastMatchingPosition( isSameTextColor );

					const textcolorRange = writer.createRange( textcolorStart, textcolorEnd );

					// Then depending on current value...
					if ( !textcolorizer || this.value === textcolorizer ) {
						// ...remove attribute when passing textcolorizer different then current or executing "eraser".

						// If we're at the end of the textcolored range, we don't want to remove textcolor of the range.
						if ( !position.isEqual( textcolorEnd ) ) {
							writer.removeAttribute( 'textcolor', textcolorRange );
						}

						writer.removeSelectionAttribute( 'textcolor' );
					} else {
						// ...update `textcolor` value.

						// If we're at the end of the textcolored range, we don't want to change the textcolor of the range.
						if ( !position.isEqual( textcolorEnd ) ) {
							writer.setAttribute( 'textcolor', textcolorizer, textcolorRange );
						}

						writer.setSelectionAttribute( 'textcolor', textcolorizer );
					}
				} else if ( textcolorizer ) {
					writer.setSelectionAttribute( 'textcolor', textcolorizer );
				}
			} else {
				const ranges = model.schema.getValidRanges( selection.getRanges(), 'textcolor' );

				for ( const range of ranges ) {
					if ( textcolorizer ) {
						writer.setAttribute( 'textcolor', textcolorizer, range );
					} else {
						writer.removeAttribute( 'textcolor', range );
					}
				}
			}
		} );
	}

}
