/* eslint-disable class-methods-use-this */
import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { html } from 'lit-html';
import '@advanced-rest-client/arc-icons/arc-icon.js';
import dropStyles from '../styles/FileDropMixin.js';

/** @typedef {import('lit-html').TemplateResult} TemplateResult */

export const dragEnterHandler = Symbol('dragEnterHandler');
export const dragLeaveHandler = Symbol('dragLeaveHandler');
export const dragOverHandler = Symbol('dragOverHandler');
export const dropHandler = Symbol('dropHandler');
export const dropTargetTemplate = Symbol('dropTargetTemplate');
export const processDroppedFiles = Symbol('processDroppedFiles');
export const dropTargetElement = Symbol('dropTargetElement');

/**
 * @param {new (...args: any[]) => any} base
 */
const mxFunction = (base) => {
  class FileDropMixinImpl extends base {
    /**
     * @returns {HTMLElement}
     */
    get [dropTargetElement]() {
      return this.shadowRoot || document.body;
    }

    constructor() {
      super();
      this[dragEnterHandler] = this[dragEnterHandler].bind(this);
      this[dragLeaveHandler] = this[dragLeaveHandler].bind(this);
      this[dragOverHandler] = this[dragOverHandler].bind(this);
      this[dropHandler] = this[dropHandler].bind(this);

      this.dropTargetActive = false;
    }

    connectedCallback() {
      if (super.connectedCallback) {
        super.connectedCallback();
      }
      const target = this[dropTargetElement];
      target.addEventListener('dragenter', this[dragEnterHandler]);
      target.addEventListener('dragleave', this[dragLeaveHandler]);
      target.addEventListener('dragover', this[dragOverHandler]);
      target.addEventListener('drop', this[dropHandler]);
    }

    disconnectedCallback() {
      if (super.disconnectedCallback) {
        super.disconnectedCallback();
      }
      const target = this[dropTargetElement];
      target.removeEventListener('dragenter', this[dragEnterHandler]);
      target.removeEventListener('dragleave', this[dragLeaveHandler]);
      target.removeEventListener('dragover', this[dragOverHandler]);
      target.removeEventListener('drop', this[dropHandler]);
    }

    /**
     * Processes dropped to the page files
     * @param {FileList} files The list of dropped files
     * @abstract This is to be implemented by the platform bindings
     */
    // eslint-disable-next-line no-unused-vars
    async [processDroppedFiles](files) {
      // ...
    }

    /**
     * @return {TemplateResult} The template for the drop file message
     */
    [dropTargetTemplate]() {
      return html`
      <div class="drop-info">
        <arc-icon icon="insertDriveFile" class="drop-icon"></arc-icon>
        <p class="drop-message">Drop the file here</p>
      </div>
      `;
    }

    /**
     * @param {DragEvent} e
     */
    [dragEnterHandler](e) {
      if (![...e.dataTransfer.types].includes('Files')) {
        return;
      }
      e.preventDefault();
      const target = this[dropTargetElement];
      target.classList.add('drop-target');
      this.dropTargetActive = true;
      e.dataTransfer.effectAllowed = 'copy';
    }

    /**
     * @param {DragEvent} e
     */
    [dragLeaveHandler](e) {
      if (![...e.dataTransfer.types].includes('Files')) {
        return;
      }
      const node = /** @type HTMLElement */ (e.target);
      if (node.nodeType !== Node.ELEMENT_NODE) {
        return;
      }
      const target = this[dropTargetElement];
      if (node !== target && !node.classList.contains('drop-info')) {
        return;
      }
      e.preventDefault();
      target.classList.remove('drop-target');
      this.dropTargetActive = false;
    }

    /**
     * @param {DragEvent} e
     */
    [dragOverHandler](e) {
      if (![...e.dataTransfer.types].includes('Files')) {
        return;
      }
      const node = /** @type HTMLElement */ (e.target);
      if (node.nodeType !== Node.ELEMENT_NODE) {
        return;
      }
      const target = this[dropTargetElement];
      if (node !== target && !node.classList.contains('drop-info')) {
        return;
      }
      e.preventDefault();
      target.classList.add('drop-target');
      this.dropTargetActive = true;
    }

    /**
     * @param {DragEvent} e
     */
    [dropHandler](e) {
      if (![...e.dataTransfer.types].includes('Files')) {
        return;
      }
      e.preventDefault();
      const target = this[dropTargetElement];
      target.classList.remove('drop-target');
      this.dropTargetActive = false;
      this[processDroppedFiles](e.dataTransfer.files);
    }
  }
  return FileDropMixinImpl;
}

/**
 * Adds methods to accept files via drag and drop.
 * The mixin register the dnd events on the body element. When an object is dragged over the window it adds
 * this `drop-target` class to the `body` element. Additionally it sets the `dropTargetActive` property.
 * 
 * The mixin also assumes that when the `drop-target` is set then the `drop-info` overlay is rendered.
 * However, it does not change the logic if the element is not in the DOM.
 * Use the provided `[dropTargetTemplate]()` function to generate template for the drag info.
 * 
 * The class implementing this mixin should override the `[processDroppedFiles](files)`  method
 * to process the incoming files.
 *
 * @mixin
 */
export const FileDropMixin = dedupeMixin(mxFunction);
Object.defineProperty(FileDropMixin, 'styles', {
  get () {
    return dropStyles;
  }
});
