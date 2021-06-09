/* eslint-disable class-methods-use-this */
import { StoreEvents, ApiSearch } from '@api-client/amf-store';
import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { html } from 'lit-html';
import '@anypoint-web-components/anypoint-button/anypoint-button.js';
import '@anypoint-web-components/anypoint-dialog/anypoint-dialog.js';
import '@anypoint-web-components/anypoint-dialog/anypoint-dialog-scrollable.js';
import { readTextFile, unzipFiles } from '../Utils.js';
import { ReportingEvents } from '../events/reporting/ReportingEvents.js';

/** @typedef {import('lit-html').TemplateResult} TemplateResult */
/** @typedef {import('lit-element').LitElement} LitElement */
/** @typedef {import('@api-client/amf-store').ContentFile} ContentFile */
/** @typedef {import('@api-client/amf-store').ImportFile} ImportFile */
/** @typedef {import('@api-client/amf-store').ApiResource} ApiResource */

export const processApiFiles = Symbol('processApiFiles');
export const processApis = Symbol('processApis');
export const filesToContent = Symbol('filesToContent');
export const readFile = Symbol('readFile');
export const importApis = Symbol('importApis');
export const fileInputTemplate = Symbol('fileInputTemplate');
export const buttonsTemplate = Symbol('buttonsTemplate');
export const filesHandler = Symbol('filesHandler');
export const selectHandler = Symbol('selectHandler');
export const cancelHandler = Symbol('cancelHandler');
export const progressTemplate = Symbol('progressTemplate');
export const apiMainFileSelectorTemplate = Symbol('apiMainFileSelectorTemplate');
export const apiFileSelectorCloseHandler = Symbol('apiFileSelectorCloseHandler');
export const acceptApiMainFile = Symbol('acceptApiMainFile');
export const supportedFilesListTemplate = Symbol('supportedFilesListTemplate');
export const afterImport = Symbol('afterImport');
export const apiMainFileSelectorOpenedValue = Symbol('apiMainFileSelectorOpenedValue');
export const processingApiImportValue = Symbol('processingApiImport');
export const importFilesValue = Symbol('importFilesValue');

/**
 * @param {new (...args: any[]) => LitElement} base
 */
const mxFunction = (base) => {
  class ApiImportMixin extends base {
    /**
     * @returns {ImportFile[]}
     */
    get supportedFiles() {
      return [
        { label: 'RAML API file', ext: '.raml' },
        { label: 'OAS API file', ext: ['.json', '.yaml'] },
        { label: 'Async API file', ext: ['.yaml'] },
        { label: 'Zipped API project', ext: ['.zip'] },
      ];
    }

    /** 
     * @returns {boolean} Whether the select API main file dialog is opened.
     */
    get apiMainFileSelectorOpened() {
      return this[apiMainFileSelectorOpenedValue];
    }

    set apiMainFileSelectorOpened(value) {
      const old = this[apiMainFileSelectorOpenedValue];
      if (old === value) {
        return;
      }
      this[apiMainFileSelectorOpenedValue] = value;
      if (this.requestUpdate) {
        this.requestUpdate('apiMainFileSelectorOpened', old);
      }
    }

    /** 
     * @returns {boolean} Whether the files are being processed right now.
     */
    get processingApiImport() {
      return this[processingApiImportValue];
    }

    set processingApiImport(value) {
      const old = this[processingApiImportValue];
      if (old === value) {
        return;
      }
      this[processingApiImportValue] = value;
      if (this.requestUpdate) {
        this.requestUpdate('processingApiImport', old);
      }
    }

    /** 
     * @returns {ContentFile[]|undefined} The list of files that are being imported.
     */
    get importFiles() {
      return this[importFilesValue];
    }

    set importFiles(value) {
      const old = this[importFilesValue];
      if (old === value) {
        return;
      }
      this[importFilesValue] = value;
      if (this.requestUpdate) {
        this.requestUpdate('importFiles', old);
      }
    }

    constructor() {
      super();
      this[selectHandler] = this[selectHandler].bind(this);
      this[cancelHandler] = this[cancelHandler].bind(this);
      this[filesHandler] = this[filesHandler].bind(this);
    }

    /**
     * The main processing function to be called when 
     * API files are available.
     * This function decides whether to continue with import or whether additional
     * processing is required.
     * 
     * @param {File[]} files
     */
    async [processApiFiles](files) {
      if (!files.length) {
        return;
      }

      const [firstFile] = files;
      if (firstFile.type === 'application/zip' || firstFile.name.endsWith('.zip')) {
        const contents = await unzipFiles(firstFile);
        await this[processApis](contents);
        return;
      }

      const result = await this[filesToContent](files);
      await this[processApis](result);
    }

    /**
     * Imports API files into the graph store.
     * @param {ContentFile[]} files
     * @param {string=} mainFile
     */
    async [processApis](files, mainFile) {
      let mainFileName = mainFile;
      if (!mainFileName && files.length > 1) {
        const search = new ApiSearch();
        const candidates = search.findApiFile(files);
        if (!candidates) {
          throw new Error(`Unable to find amy API files.`);
        }
        if (Array.isArray(candidates)) {
          if (!candidates.length) {
            throw new Error(`Unable to find amy API files.`);
          }
          this.importFiles = candidates;
          this.apiMainFileSelectorOpened = true;
          return;
        }
        mainFileName = candidates.name;
      } 
      if (!mainFileName) {
        mainFileName = files[0].name;
      }
      await this[importApis](files, mainFileName);
    }

    /**
     * A function that calls the store with the files data.
     * @param {ContentFile[]} files
     * @param {string} main
     */
    async [importApis](files, main) {
      this.processingApiImport = true;
      try {
        const contents = files.find((f) => f.name === main);
        const search = new ApiSearch();
        const typeInfo = search.readApiType(contents);
        const resources = /** @type ApiResource[] */ (files.map((item) => 
           /** @type ApiResource */({
            contents: item.content,
            path: item.name,
          })
        ));
        await StoreEvents.Store.loadApi(this, resources, main, typeInfo.type, typeInfo.contentType);
        this[afterImport]();
      } catch (e) {
        ReportingEvents.error(this, e, `Unable to import API: ${e.message}`, this.localName);
      }
      this.processingApiImport = false;
    }

    /**
     * Reads a single file to string
     * @param {File} file A file to process
     * @return {Promise<ContentFile>} File content
     */
    async [readFile](file) {
      const content = await readTextFile(file);
      const info = /** @type ContentFile */ ({
        lastModified: file.lastModified,
        name: file.name,
        size: file.size,
        type: file.type,
        content,
      });
      return info;
    }

    /**
     * Processes files to read it's content and returns file like object with the `content` property.
     * @param {File[]} files List of files to process.
     * @return {Promise<ContentFile[]>} File like object with `content` property.
     */
    async [filesToContent](files) {
      const ps = files.map((file) => this[readFile](file));
      return Promise.all(ps);
    }

    /**
     * @param {Event} e
     */
    async [filesHandler](e) {
      const node = /** @type HTMLInputElement */ (e.target);
      const { files } = node;
      try {
        await this[processApiFiles](Array.from(files));
      } catch (cause) {
        ReportingEvents.error(this, cause, `Unable to process API project: ${cause.message}`, this.localName);
      }
    }

    [selectHandler]() {
      const input = /** @type HTMLInputElement */ ((this.shadowRoot || document.body).querySelector('input[type="file"]'));
      input.click();
    }
    
    /**
     * Called when the import has been cancelled.
     * To be implemented by the child class.
     */
    [cancelHandler]() {
      // 
    }

    /**
     * Called when the import finish.
     * The implementing class should use this to do some job after the import.
     */
    async [afterImport]() {
      // 
    }

    [apiFileSelectorCloseHandler]() {
      this.apiMainFileSelectorOpened = false;
      this.importFiles = undefined;
    }

    /**
     * A handler for the API main file dialog item selection.
     * @param {Event} e
     */
    [acceptApiMainFile](e) {
      const { importFiles } = this;
      const button = /** @type HTMLElement */ (e.target);
      const { name } = button.dataset;
      this.apiMainFileSelectorOpened = false;
      this.importFiles = undefined;
      this[importApis](importFiles, name);
    }

    /**
     * @returns {TemplateResult} The template for the file input
     */
    [fileInputTemplate]() {
      const { supportedFiles } = this;
      const accept = supportedFiles.map(({ext}) => Array.isArray(ext) ? ext.join(',') : ext ).join(',');
      return html`<input hidden type="file" accept="${accept}" @change="${this[filesHandler]}" multiple/>`;
    }

    /**
     * @returns {TemplateResult} The template for the action buttons
     */
    [buttonsTemplate]() {
      return html`
        <anypoint-button @click="${this[selectHandler]}" emphasis="high">Select file(s)</anypoint-button>
        <anypoint-button @click="${this[cancelHandler]}" emphasis="low">Cancel</anypoint-button>
      `;
    }

    /**
     * @returns {TemplateResult} The template for the progress bar
     */
    [progressTemplate]() {
      return html`<progress class="api-import-progress"></progress>`;
    }

    [apiMainFileSelectorTemplate]() {
      const { apiMainFileSelectorOpened, importFiles=[] } = this;
      const final = importFiles.filter((item) => !item.name.startsWith('.') && item.size > 0);
      return html`
      <anypoint-dialog
        ?opened="${apiMainFileSelectorOpened}"
        class="import-dialog"
        withBackdrop
        @closed="${this[apiFileSelectorCloseHandler]}"
      >
        <h2 class="title">Select API main file</h2>
        <anypoint-dialog-scrollable>
          <div class="files-list">
            ${final.map((item) => html`
            <div class="file-item">
              <div class="file-name">${item.name}</div>
              <anypoint-button data-name="${item.name}" @click="${this[acceptApiMainFile]}">Open</anypoint-button>
            </div>
            `)}
          </div>
        </anypoint-dialog-scrollable>
        <div class="buttons">
          <anypoint-button data-dialog-dismiss>Cancel</anypoint-button>
        </div>
      </anypoint-dialog>
      `;
    }

    /**
     * @returns {TemplateResult|TemplateResult[]} The template for the list of supported files to import
     */
    [supportedFilesListTemplate]() {
      const { supportedFiles } = this;
      return supportedFiles.map(({label, ext}) => {
        let typesLabel = ext;
        if (Array.isArray(typesLabel)) {
          typesLabel = typesLabel.join(', ');
        }
        return html`<li>${label} (${typesLabel})</li>`;
      });
    }
  }
  return ApiImportMixin;
}

/**
 * Adds methods to support Importing API project.
 *
 * @mixin
 */
export const ApiImportMixin = dedupeMixin(mxFunction);
