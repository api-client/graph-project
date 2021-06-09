import { LitElement, html } from 'lit-element';
import { 
  ApiImportMixin,
  supportedFilesListTemplate,
  progressTemplate,
  buttonsTemplate,
  fileInputTemplate,
  apiMainFileSelectorTemplate,
  processApiFiles,
  cancelHandler,
  afterImport,
} from './mixins/ApiImportMixin.js';
import { 
  FileDropMixin,
  dropTargetTemplate,
  processDroppedFiles,
} from './mixins/FileDropMixin.js';
import elementStyles from './styles/ApiImport.js';
import dropStyles from './styles/FileDropMixin.js';

export default class GraphApiImportElement extends ApiImportMixin(FileDropMixin(LitElement)) {
  static get styles() {
    return [elementStyles, dropStyles];
  }

  /**
   * Processes dropped to the page files
   * @param {FileList} files The list of dropped files
   */
  async [processDroppedFiles](files) {
    this[processApiFiles](Array.from(files));
  }

  [cancelHandler]() {
    this.dispatchEvent(new Event('cancel'));
  }

  [afterImport]() {
    this.dispatchEvent(new Event('finish'));
  }

  render() {
    return html`
    <div class="centered text-centered">
      <div class="title-line">
        <h2>Import API project</h2>
      </div>
      <p class="notice">
        Select a file to import into the application.
      </p>
      <div class="notice">
        <div>Currently supported files are:</div>
        <ul class="supported-files">
          ${this[supportedFilesListTemplate]()}
        </ul>
      </div>
      <div class="button">
      ${this.processingApiImport ? this[progressTemplate]() : this[buttonsTemplate]()}
      </div>
    </div>
    ${this[fileInputTemplate]()}  
    ${this[dropTargetTemplate]()}
    ${this[apiMainFileSelectorTemplate]()}
    `;
  }
}
