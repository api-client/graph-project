import { CSSResult, LitElement, TemplateResult } from 'lit-element';
import { 
  ApiImportMixin,
} from './mixins/ApiImportMixin';
import { 
  FileDropMixin,
  processDroppedFiles,
} from './mixins/FileDropMixin';

/**
 * @fires cancel
 * @fires finish
 */
export default class GraphApiImportElement extends ApiImportMixin(FileDropMixin(LitElement)) {
  static get styles(): CSSResult[];

  /**
   * Processes dropped to the page files
   * @param files The list of dropped files
   */
  [processDroppedFiles](files: FileList): Promise<void>;

  render(): TemplateResult;
}
