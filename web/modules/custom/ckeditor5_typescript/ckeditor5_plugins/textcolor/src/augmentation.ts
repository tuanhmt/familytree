import TextColorCommand from "./textcolorcommand";
import { TextColorConfig } from "./textcolorconfig";

declare module '@ckeditor/ckeditor5-core' {
  interface EditorConfig {

    /**
     * The configuration of the {@link module:textcolor/textcolor~TextColor} feature.
     *
     * Read more in {@link module:textcolor/textcolorconfig~TextColorConfig}.
     */
    textcolor?: TextColorConfig;
  }

  interface CommandsMap {
    textcolor: TextColorCommand;
  }
}