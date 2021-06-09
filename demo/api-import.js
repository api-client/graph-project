  /* eslint-disable lit-a11y/click-events-have-key-events */
import { html } from 'lit-html';
import { DemoPage } from '@advanced-rest-client/arc-demo-helper';
import { AmfStoreService } from '@api-client/amf-store';
import { ReportingEventTypes } from '../src/events/reporting/ReportingEventTypes.js';
import '../graph-api-import.js';
import '../graph-alert-dialog.js';

/** @typedef {import('../index').GraphApiImportElement} GraphApiImportElement */
/** @typedef {import('../index').GraphErrorEvent} GraphErrorEvent */

class ComponentPage extends DemoPage {
  constructor() {
    super();
    this.initObservableProperties(['initialized', 'loaded', 'latestOutput']);
    this.initialized = false;
    this.loaded = false;
    this.latestOutput = '';
    this.renderViewControls = true;
    this.store = new AmfStoreService(window, {
      amfLocation: '/node_modules/@api-client/amf-store/amf-bundle.js',
    });
    this.componentName = 'graph-api-import';
    this.actionHandler = this.actionHandler.bind(this);
    this.cancelHandler = this.cancelHandler.bind(this);
    this.finishHandler = this.finishHandler.bind(this);
    this.initStore();

    window.addEventListener(ReportingEventTypes.error, this._errorHandler.bind(this))
  }

  async initStore() {
    await this.store.init();
    this.initialized = true;
  }

  /**
   * @param {GraphErrorEvent} e
   */
  _errorHandler(e) {
    const { error, description, component } = e;
    console.error(description, 'In component', component);
    console.error(error);

    const dialog = document.createElement('graph-alert-dialog');
    dialog.message = description;
    dialog.modal = true;
    dialog.open();
    document.body.appendChild(dialog);
  }

  /**
   * @param {Event} e 
   */
   async actionHandler(e) {
    const button = /** @type HTMLButtonElement */ (e.target);
    if (typeof this[button.id] === 'function') {
      this[button.id]();
      return;
    }
    switch (button.id) {
      default: console.warn(`Unhandled action ${button.id}`);
    }
  }

  async listEndpoints() {
    const result = await this.store.listEndpoints();
    this.log(result);
  }

  async listEndpointsWithOperations() {
    const result = await this.store.listEndpointsWithOperations();
    this.log(result);
  }

  async listTypes() {
    const result = await this.store.listTypes(); 
    this.log(result);
  }

  async listSecurity() {
    const result = await this.store.listSecurity(); 
    this.log(result);
  }

  /**
   * @param {any} message 
   */
  log(message) {
    this.latestOutput = JSON.stringify(message, null, 2);
    console.log(message);
  }

  cancelHandler() {
    this.loaded = false;
  }

  finishHandler() {
    this.loaded = true;
  }

  contentTemplate() {
    const { initialized, loaded, latestOutput } = this;
    if (!initialized) {
      return html`<p>Initializing the store</p>`;
    }
    return html`
    <section class="documentation-section">
      <graph-api-import @cancel="${this.cancelHandler}" @finish="${this.finishHandler}"></graph-api-import>
    </section>

    <section class="documentation-section">
      <h4>Reading data</h4>
      <div @click="${this.actionHandler}">
        <button id="listEndpoints" ?disabled="${!loaded}">List endpoints</button>
        <button id="listEndpointsWithOperations" ?disabled="${!loaded}">List endpoints & operations</button>
        <button id="listTypes" ?disabled="${!loaded}">List types</button>
        <button id="listSecurity" ?disabled="${!loaded}">List security</button>
      </div>

      <div>
        <h4>Latest result</h4>
        <output>${latestOutput}</output>
      </div>
    </section>
    `;
  }
}
const instance = new ComponentPage();
instance.render();
