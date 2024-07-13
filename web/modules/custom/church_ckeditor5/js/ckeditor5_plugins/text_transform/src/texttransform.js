
import { Plugin } from 'ckeditor5/src/core';
import { addListToDropdown, createDropdown, Model } from 'ckeditor5/src/ui';
import { Collection } from 'ckeditor5/src/utils';
import TextTransformCommand from './texttransformcommand';

import TextTransformIcon from "./../theme/icons/letter-case.svg";

const TextTransformOptions = [
  {
    text: "Sentence case",
    mode: "sentenceCase"
  },
  {
    text: "lower case",
    mode: "lowerCase"
  },
  {
    text: "UPPER CASE",
    mode: "upperCase"
  },
  {
    text: "Capitalize Case",
    mode: "capitalizeCase"
  },
];

export default class TextTransform extends Plugin {
  init() {
    // Register the Text Transform Command
    this.editor.commands.add("TextTransform", new TextTransformCommand(this.editor));

    // Initializing UI
    this.editor.ui.componentFactory.add("TextTransform", locale => {
      const dropdownView = createDropdown(locale);
      addListToDropdown(
        dropdownView,
        this.getDropdownItemsDefinitions(TextTransformOptions)
      );

      dropdownView.buttonView.set({
        label: "Text Transform",
        tooltip: "Text Transform",
        withText: false,
        icon: TextTransformIcon
      });

      // bindi UI with the Command
      const command = this.editor.commands.get("TextTransform");
      dropdownView.bind("isOn", "isEnabled").to(command, "value", "isEnabled");

      // Execute the Command through the UI
      this.listenTo(dropdownView, "execute", evt => {
        const command = evt.source.commandParam;
        this.editor.execute('TextTransform', command)
      });

      return dropdownView;
    });
  }

  // Generate Item Definitions for UI
  getDropdownItemsDefinitions() {
    const itemDefinitions = new Collection();

    for (const option of TextTransformOptions) {
      const definition = {
        type: "button",
        model: new Model({
          commandParam: option.mode,
          label: option.text,
          withText: true
        })
      };
      
      itemDefinitions.add(definition);
    }

    return itemDefinitions;
  }
}


