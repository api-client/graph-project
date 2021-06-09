/* eslint-disable lit-a11y/click-events-have-key-events */
import { html } from 'lit-html';
import { DemoPage } from '@advanced-rest-client/arc-demo-helper';
import '@advanced-rest-client/arc-demo-helper/arc-interactive-demo.js';
import '@anypoint-web-components/anypoint-dropdown-menu/anypoint-dropdown-menu.js';
import '@anypoint-web-components/anypoint-listbox/anypoint-listbox.js';
import '@anypoint-web-components/anypoint-item/anypoint-item.js';
import '@anypoint-web-components/anypoint-checkbox/anypoint-checkbox.js';
import { AmfStoreService } from '@api-client/amf-store';
import { NavigationEventTypes, NavigationEditCommands, NavigationContextMenu, ReportingEventTypes } from '../index.js';
import '../graph-api-navigation.js';

/** @typedef {import('../index').APIGraphNavigationEvent} APIGraphNavigationEvent */
/** @typedef {import('../index').APIExternalNavigationEvent} APIExternalNavigationEvent */
/** @typedef {import('../index').GraphErrorEvent} GraphErrorEvent */

class ComponentPage extends DemoPage {
  constructor() {
    super();
    this.initObservableProperties([
      'loaded', 'initialized',
      'query',
      'latestSelected', 'latestType', 'latestEndpoint',
      'summary', 'sort', 'filter',
      'selectedId', 'selectedType', 'selectedOptions',
      'edit', 'apiId'
    ]);
    this.loaded = false;
    this.initialized = false;
    this.renderViewControls = true;
    this.summary = true;
    this.sort = true;
    this.filter = true;
    this.edit = true;
    this.selectedId = undefined;
    this.selectedType = undefined;
    this.selectedOptions = undefined;
    this.apiId = undefined;
    this.store = new AmfStoreService(window, {
      amfLocation: '/node_modules/@api-client/amf-store/amf-bundle.js',
    });
    this.componentName = 'graph-api-navigation';
    this.actionHandler = this.actionHandler.bind(this);
    window.addEventListener(NavigationEventTypes.navigate, this.navigationHandler.bind(this));
    window.addEventListener(NavigationEventTypes.navigateExternal, this.externalNavigationHandler.bind(this));
    window.addEventListener(ReportingEventTypes.error, this.errorHandler.bind(this));
    this.initStore();
  }

  async firstRender() {
    await super.firstRender();
    const element = document.body.querySelector('graph-api-navigation');
    if (element) {
      this.contextMenu = new NavigationContextMenu(element);
      this.contextMenu.registerCommands(NavigationEditCommands);
      this.contextMenu.connect();
    }
  }

  /**
   * @param {GraphErrorEvent} e 
   */
  errorHandler(e) {
    const { error, description, component } = e;
    console.error(`[${component}]: ${description}`);
    console.error(error);
  }

  async initStore() {
    await this.store.init();
    this.initialized = true;
  }

  /**
   * @param {Event} e 
   */
  async actionHandler(e) {
    const button = /** @type HTMLButtonElement */ (e.target);
    switch (button.id) {
      case 'init': this.initStore(); break;
      case 'loadApiGraph': this.loadDemoApi(button.dataset.src); break;
      case 'createWebApi': this.createWebApi(); break;
      default: console.warn(`Unhandled action ${button.id}`);
    }
  }

  async loadDemoApi(file) {
    this.loaded = false;
    const rsp = await fetch(`./${file}`);
    const model = await rsp.text();
    await this.store.loadGraph(model);
    const api = await this.store.getApi();
    this.apiId = api.id;
    this.loaded = true;
  }

  async createWebApi() {
    this.loaded = false;
    const api = await this.store.createWebApi();
    this.apiId = api;
    this.loaded = true;
  }

  /**
   * @param {APIGraphNavigationEvent} e 
   */
  navigationHandler(e) {
    const { graphId, graphType, options } = e;
    this.selectedId = graphId;
    this.selectedType = graphType;
    this.selectedOptions = options;
  }

  /**
   * @param {APIExternalNavigationEvent} e
   */
  externalNavigationHandler(e) {
    e.preventDefault();
    const { url } = e;
    console.log('Opening', url);
    window.open(url);
  }

  contentTemplate() {
    return html`
      <h2>Graph API navigation</h2>
      ${this._demoTemplate()}
      ${this._dataTemplate()}
    `;
  }

  _demoTemplate() {
    const { loaded } = this;
    return html`
    <section class="documentation-section">
      <h3>Interactive demo</h3>
      <p>
        This demo lets you preview the Graph API navigation document with various configuration options.
      </p>

      ${this._navTemplate()}
      ${!loaded ? html`<p>Load an API model first.</p>` : ''}
    </section>
    `;
  }

  _navTemplate() {
    const { demoStates, darkThemeActive, summary, sort, filter, edit, selectedId, selectedOptions, selectedType, apiId } = this;
    return html`
    <arc-interactive-demo
      .states="${demoStates}"
      @state-changed="${this._demoStateHandler}"
      ?dark="${darkThemeActive}"
    >
      <graph-api-navigation
        endpointsOpened
        .apiId="${apiId}"
        ?summary="${summary}"
        ?sort="${sort}"
        ?filter="${filter}"
        ?edit="${edit}"
        manualQuery
        slot="content"
      >
      </graph-api-navigation>

      <label slot="options" id="mainOptionsLabel">Options</label>
      <anypoint-checkbox
        aria-describedby="mainOptionsLabel"
        slot="options"
        name="summary"
        .checked="${summary}"
        @change="${this._toggleMainOption}"
      >
        Summary
      </anypoint-checkbox>
      <anypoint-checkbox
        aria-describedby="mainOptionsLabel"
        slot="options"
        name="sort"
        .checked="${sort}"
        @change="${this._toggleMainOption}"
      >
        Sort endpoints
      </anypoint-checkbox>
      <anypoint-checkbox
        aria-describedby="mainOptionsLabel"
        slot="options"
        name="filter"
        .checked="${filter}"
        @change="${this._toggleMainOption}"
      >
        Filter input
      </anypoint-checkbox>
      <anypoint-checkbox
        aria-describedby="mainOptionsLabel"
        slot="options"
        name="edit"
        .checked="${filter}"
        @change="${this._toggleMainOption}"
      >
        Edit graph
      </anypoint-checkbox>

    </arc-interactive-demo>

    <div class="current-selection">
      <h3>Current selection</h3>
      Graph Id: ${selectedId}<br/>
      Graph type: ${selectedType}<br/>
      Nav options: ${selectedOptions ? JSON.stringify(selectedOptions, null, 2) : ''}<br/>
    </div>
    `;
  }
  
  _dataTemplate() {
    const { initialized } = this;
    return html`
    <section class="documentation-section">
      <h3>Store actions</h3>

      <h4>Initialization</h4>
      <div @click="${this.actionHandler}">
        <button id="init">Init</button>
        <button id="loadApiGraph" data-src="demo-api-compact.json" ?disabled="${!initialized}">Load demo API</button>
        <button id="loadApiGraph" data-src="async-api-compact.json" ?disabled="${!initialized}">Load async API</button>
        <button id="loadApiGraph" data-src="google-drive-api.json" ?disabled="${!initialized}">Load Google Drive API</button>
        <button id="loadApiGraph" data-src="streetlights-compact.json" ?disabled="${!initialized}">Streetlights (async) API</button>
        <button id="loadApiGraph" data-src="oas-3-api.json" ?disabled="${!initialized}">OAS 3</button>
        <button id="createWebApi" ?disabled="${!initialized}">Create empty Web API</button>
      </div>
    </section>
    `;
  }
}
const instance = new ComponentPage();
instance.render();
