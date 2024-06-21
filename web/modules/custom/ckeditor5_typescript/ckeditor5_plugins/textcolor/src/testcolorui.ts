import { Plugin } from 'ckeditor5/src/core';
import {
  addToolbarToDropdown,
  createDropdown,
  SplitButtonView,
  ToolbarSeparatorView,
  type DropdownView 
} from 'ckeditor5/src/ui';
import TextColorCommand from './textcolorcommand';
import { TextColorOption } from './textcolorconfig';
import TextColorIcon from '../../../icons/font-color.svg';
import { ColorTileView } from 'ckeditor5/src/ui';

/**
 * Plugin UI discription.
 */
export default class TextColorUI extends Plugin {
  /**
   * @inheritDoc
   */
  public static get pluginName() {
    return 'TextColorUI' as const;
  }

  /**
   * @inheritDoc
   */
  init() {
    const options = this.editor.config.get('textcolor.options')!;
    for (const option of options) {
      this._addTextColorizerButton(option);
    }
    this._addRemoveColorButton();
    this._addDropdown(options);
  }

  /**
   * Creates the "Remove color" button.
   */
  private _addRemoveColorButton(): void {
    const t = this.editor.t;
    const command: TextColorCommand = this.editor.commands.get('textcolor')!;

    this._addButton('removeTextColor', t('Remove text color'), null, null, button => {
      button.bind('isEnabled').to(command, 'isEnabled');
    });
  }

  /**
   * Creates a toolbar button from the provided textcolor option.
   */
  private _addTextColorizerButton(option: TextColorOption) {
    const command: TextColorCommand = this.editor.commands.get('textcolor')!;

    // TODO: change naming
    this._addButton('textcolor:' + option.model, option.title, null, option.model, decorateTextColorButton);

    function decorateTextColorButton(button: ColorTileView) {
      button.bind('isEnabled').to(command, 'isEnabled');
      button.bind('isOn').to(command, 'value', value => value === option.model);
      button.iconView.fillColor = option.color;
      button.set({
        color: option.color,
      });
      button.isToggleable = true;
    }
  }

  /**
   * Internal method for creating textcolor buttons.
   *
   * @param name The name of the button.
   * @param label The label for the button.
   * @param icon The button icon.
   * @param value The `value` property passed to the executed command.
   * @param decorateButton A callback getting ButtonView instance so that it can be further customized.
   */
  private _addButton(name: string, label: string, icon: string | null, value: string | null, decorateButton: (button: ColorTileView) => void) {
    const editor = this.editor;

    editor.ui.componentFactory.add(name, locale => {
      const buttonView = new ColorTileView(locale);

      if (label) {
        buttonView.set({
          label: label,
          tooltip: true,
        });
      }

      if (icon) {
        buttonView.set({
          icon: icon
        });
      }

      buttonView.set({
        hasBorder: false
      });

      buttonView.on('execute', () => {
        editor.execute('textcolor', { value });
        editor.editing.view.focus();
      });

      // Add additional behavior for buttonView.
      decorateButton(buttonView);

      return buttonView;
    });
  }

  /**
   * Creates the split button dropdown UI from the provided textcolor options.
   */
  private _addDropdown(options: Array<TextColorOption>) {
    const editor = this.editor;
    const t = editor.t;
    const componentFactory = editor.ui.componentFactory;

    const startingTextColorizer = options[0];

    // const optionsMap = options.reduce((retVal, option) => {
    //   retVal[option.model] = option;

    //   return retVal;
    // }, {} as Record<string, TextColorOption>);

    componentFactory.add('textColor', locale => {
      const command: TextColorCommand = editor.commands.get('textcolor')!;
      const dropdownView = createDropdown(locale, SplitButtonView);
      const splitButtonView = dropdownView.buttonView as TextColorSplitButtonView;

      splitButtonView.set({
        label: t('Text Color'),
        tooltip: true,
        // Holds last executed textcolorizer.
        lastExecuted: startingTextColorizer?.model,
        // Holds current textcolorizer to execute (might be different then last used).
        commandValue: startingTextColorizer?.model,
        isToggleable: true,
        icon: TextColorIcon
      });

      // Dropdown button changes to selection (command.value):
      // - If selection is in textcolor it get active textcolor appearance (icon, color) and is activated.
      // - Otherwise it gets appearance (icon, color) of last executed textcolor.
      // splitButtonView.bind('color').to(command, 'value', value => getActiveOption(value, 'color'));
      // splitButtonView.bind('commandValue').to(command, 'value', value => getActiveOption(value, 'model'));
      // splitButtonView.bind('isOn').to(command, 'value', value => !!value);

      splitButtonView.delegate('execute').to(dropdownView);

      // Create buttons array.
      const buttonsCreator = () => {
        const buttons = options.map(option => {
          // Get existing textcolorizer button.
          const buttonView = componentFactory.create('textcolor:' + option.model);

          // Update lastExecutedTextColor on execute.
          this.listenTo(buttonView, 'execute', () => {
            (dropdownView.buttonView as TextColorSplitButtonView).set({ lastExecuted: option.model });
          });

          return buttonView;
        });

        // Add separator and eraser buttons to dropdown.
        buttons.push(new ToolbarSeparatorView());
        buttons.push(componentFactory.create('removeTextColor'));

        return buttons;
      };

      // Make toolbar button enabled when any button in dropdown is enabled before adding separator and eraser.
      dropdownView.bind('isEnabled').to(command, 'isEnabled');

      addToolbarToDropdown(dropdownView, buttonsCreator, {
        enableActiveItemFocusOnDropdownOpen: true,
        ariaLabel: t('Text textcolor toolbar')
      });
      bindToolbarIconStyleToActiveColor(dropdownView);

      // Execute current action from dropdown's split button action button.
      splitButtonView.on('execute', () => {
        editor.execute('textcolor', { value: splitButtonView.commandValue });
      });

      // Focus the editable after executing the command.
      // It overrides a default behaviour where the focus is moved to the dropdown button (#12125).
      this.listenTo(dropdownView, 'execute', () => {
        editor.editing.view.focus();
      });

      /**
       * Returns active textcolorizer option depending on current command value.
       * If current is not set or it is the same as last execute this method will return the option key (like icon or color)
       * of last executed textcolorizer. Otherwise it will return option key for current one.
       */
      // function getActiveOption<Key extends keyof TextColorOption>(current: string | undefined, key: Key): TextColorOption[Key] {
      //   const whichTextColorizer = !current ||
      //     current === splitButtonView.lastExecuted ? splitButtonView.lastExecuted : current;
      //     return optionsMap?[ whichTextColorizer! ][ key ];
      // }

      return dropdownView;
    });
  }
}

/**
   * Extends split button icon style to reflect last used button style.
   */
function bindToolbarIconStyleToActiveColor(dropdownView: DropdownView): void {
  const actionView = (dropdownView.buttonView as TextColorSplitButtonView).actionView;

  actionView.iconView.bind('fillColor').to((dropdownView.buttonView! as TextColorSplitButtonView), 'color');
}

type TextColorSplitButtonView = SplitButtonView & {
  lastExecuted: string;
  commandValue: string;
  color: string;
};
