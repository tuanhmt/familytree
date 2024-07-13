import { Command } from 'ckeditor5/src/core';
import { changeCase } from "./utils";

export default class TextTransformCommand extends Command {
  execute(mode) {

    const model = this.editor.model;
    const selection = model.document.selection;
    const range = selection.getFirstRange();
    for ( const item of range.getItems() ) {
      model.change(writer => {
        if (item.is('model:$textProxy')) {
          let item_range = model.createRangeOn(item);
          model.insertContent(writer.createText(changeCase(mode, item.data), item.getAttributes()), item_range);
          let selection = writer.createSelection(range);
          writer.setSelection(selection);
        }
      })
    }
  }
}
