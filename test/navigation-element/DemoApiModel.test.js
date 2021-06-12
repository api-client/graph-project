import { fixture, assert, html } from '@open-wc/testing';
import { AmfStoreService, StoreEventTypes } from '@api-client/amf-store/worker.index.js';
import { aTimeout, nextFrame, oneEvent } from '@open-wc/testing-helpers';
import sinon from 'sinon';
import { AmfLoader } from '../helpers/AmfLoader.js';
import '../../graph-api-navigation.js';
import { 
  openedEndpointsValue,
  endpointsValue,
  isAsyncValue,
  queryApi,
  queryEndpoints,
  queryDocumentations,
  documentationsValue,
  querySchemas,
  schemasValue,
  querySecurity,
  securityValue,
  shiftTabPressedValue,
  focusedItemValue,
  customPropertiesValue,
  queryCustomProperties,
} from '../../src/GraphApiNavigationElement.js';
import { ReportingEventTypes } from '../../src/events/reporting/ReportingEventTypes.js';

/** @typedef {import('@anypoint-web-components/anypoint-collapse').AnypointCollapseElement} AnypointCollapseElement */
/** @typedef {import('../..').GraphApiNavigationElement} GraphApiNavigationElement */

describe('GraphApiNavigationElement', () => {
  let store = /** @type AmfStoreService */ (null);
  before(async () => {
    const api = await AmfLoader.loadApi();
    store = new AmfStoreService(window, {
      amfLocation: '/node_modules/@api-client/amf-store/amf-bundle.js',
    });
    await store.init();
    await store.loadGraph(api);
  });

  describe('Demo API model', () => {
    /**
     * @returns {Promise<GraphApiNavigationElement>}
     */
    async function dataFixture() {
      const elm = /** @type GraphApiNavigationElement */ (await fixture(html`
        <graph-api-navigation 
          summary 
          sort 
          filter
          endpointsOpened
          documentationsOpened
          schemasOpened
          securityOpened
          customProperties
          customPropertiesOpened></graph-api-navigation>
      `));
      await oneEvent(elm, 'graphload');
      await nextFrame();
      return elm;
    }

    /**
     * @returns {Promise<GraphApiNavigationElement>}
     */
    async function noSortingFixture() {
      const elm = /** @type GraphApiNavigationElement */ (await fixture(html`
        <graph-api-navigation 
          endpointsOpened
          documentationsOpened
          schemasOpened
          securityOpened
          customProperties
          customPropertiesOpened></graph-api-navigation>
      `));
      await oneEvent(elm, 'graphload');
      await nextFrame();
      return elm;
    }

    /**
     * @returns {Promise<GraphApiNavigationElement>}
     */
    async function basicDataFixture() {
      const elm = /** @type GraphApiNavigationElement */ (await fixture(html`
        <graph-api-navigation></graph-api-navigation>
      `));
      await oneEvent(elm, 'graphload');
      await nextFrame();
      return elm;
    }

    describe('Section data rendering', () => {
      let element = /** @type GraphApiNavigationElement */ (null);
      before(async () => { element = await dataFixture() });

      it('has the summary', () => {
        const node = element.shadowRoot.querySelector('.summary');
        assert.ok(node);
      });
  
      it('has the endpoints', () => {
        const panel = element.shadowRoot.querySelector('.endpoints');
        assert.ok(panel);
      });

      it('endpoints are opened', () => {
        const panel = /** @type AnypointCollapseElement */ (element.shadowRoot.querySelector('.endpoints anypoint-collapse'));
        assert.isTrue(panel.opened);
      });

      it('renders endpoints list', () => {
        const items = element.shadowRoot.querySelectorAll('.endpoints .list-item.endpoint');
        assert.lengthOf(items, 14);
      });

      it('has endpoints title for a web API', () => {
        const titleElm = element.shadowRoot.querySelector('.endpoints .title-h3');
        const content = titleElm.textContent.trim();
        assert.equal(content, 'Endpoints');
      });

      it('has the operations toggle button', () => {
        const item = element.shadowRoot.querySelector('.endpoint[data-path="/arrayBody"] .toggle-button.endpoint');
        assert.ok(item);
      });

      it('has no operations toggle button when no operations', () => {
        const item = element.shadowRoot.querySelector('.endpoint[data-path="/orgs"] .toggle-button.endpoint');
        assert.notOk(item, 'has no toggle button');
        const mock = element.shadowRoot.querySelector('.endpoint[data-path="/orgs"] .endpoint-toggle-mock');
        assert.ok(mock, 'has the mock container');
      });

      it('operations are not rendered', () => {
        const item = element.shadowRoot.querySelector('.endpoints .list-item.endpoint');
        const collapse = /** @type AnypointCollapseElement */ (item.nextElementSibling);
        assert.isFalse(collapse.opened);
      });

      it('has the documentations', () => {
        const panel = element.shadowRoot.querySelector('.documentation');
        assert.ok(panel);
      });

      it('opens the documentations section', () => {
        const panel = /** @type AnypointCollapseElement */ (element.shadowRoot.querySelector('.documentation anypoint-collapse'));
        assert.isTrue(panel.opened);
      });

      it('has the documentation items', () => {
        const items = element.shadowRoot.querySelectorAll('.documentation .list-item');
        assert.lengthOf(items, 1);
      });

      it('has the schemas', () => {
        const panel = element.shadowRoot.querySelector('.schemas');
        assert.ok(panel);
      });
      
      it('opens the schemas section', () => {
        const panel = /** @type AnypointCollapseElement */ (element.shadowRoot.querySelector('.schemas anypoint-collapse'));
        assert.isTrue(panel.opened);
      });

      it('has the schemas items', () => {
        const items = element.shadowRoot.querySelectorAll('.schemas .list-item');
        assert.lengthOf(items, 12);
      });

      it('has the security', () => {
        const panel = element.shadowRoot.querySelector('.security');
        assert.ok(panel);
      });

      it('opens the security section', () => {
        const panel = /** @type AnypointCollapseElement */ (element.shadowRoot.querySelector('.security anypoint-collapse'));
        assert.isTrue(panel.opened);
      });

      it('has the security items', () => {
        const items = element.shadowRoot.querySelectorAll('.security .list-item');
        assert.lengthOf(items, 3);
      });

      it('has the custom properties', () => {
        const panel = element.shadowRoot.querySelector('.custom-properties');
        assert.ok(panel);
      });

      it('opens the custom properties', () => {
        const panel = /** @type AnypointCollapseElement */ (element.shadowRoot.querySelector('.custom-properties anypoint-collapse'));
        assert.isTrue(panel.opened);
      });

      it('has the custom property items', () => {
        const items = element.shadowRoot.querySelectorAll('.custom-properties .list-item');
        assert.lengthOf(items, 3);
      });
    });

    describe('Toggling list items', () => {
      let element = /** @type GraphApiNavigationElement */ (null);
      beforeEach(async () => { element = await dataFixture() });

      it('toggles operations list', async () => {
        const button = /** @type HTMLElement */ (element.shadowRoot.querySelector('.endpoint[data-path="/arrayBody"] .toggle-button.endpoint'));
        button.click();
        await nextFrame();
        assert.deepEqual(element[openedEndpointsValue], [button.dataset.graphId], 'adds endpoint item to [openedEndpointsValue]');
        const collapse = /** @type AnypointCollapseElement */ (button.parentElement.nextElementSibling);
        assert.isTrue(collapse.opened, 'the children collapse is opened');
      });

      it('toggles back operations list', async () => {
        const button = /** @type HTMLElement */ (element.shadowRoot.querySelector('.endpoint[data-path="/arrayBody"] .toggle-button.endpoint'));
        button.click();
        await nextFrame();
        button.click();
        await nextFrame();
        assert.deepEqual(element[openedEndpointsValue], [], 'removes the endpoint from [openedEndpointsValue]');
        const collapse = /** @type AnypointCollapseElement */ (button.parentElement.nextElementSibling);
        assert.isFalse(collapse.opened, 'the children collapse is closed');
      });

      it('does not select an item when toggling operations', async () => {
        const button = /** @type HTMLElement */ (element.shadowRoot.querySelector('.endpoint[data-path="/arrayBody"] .toggle-button.endpoint'));
        button.click();
        await nextFrame();
        assert.isUndefined(element.selected);
      });

      it('toggles endpoints section', async () => {
        const title = /** @type HTMLElement */ (element.shadowRoot.querySelector('.endpoints .section-title'));
        title.click();
        await nextFrame();
        // it is initially opened
        assert.isFalse(element.endpointsOpened, 'endpointsOpened is updated');
        const collapse = /** @type AnypointCollapseElement */ (title.nextElementSibling);
        assert.isFalse(collapse.opened, 'collapse is closed')
      });

      it('toggles documentations section', async () => {
        const title = /** @type HTMLElement */ (element.shadowRoot.querySelector('.documentation .section-title'));
        title.click();
        await nextFrame();
        // it is initially opened
        assert.isFalse(element.documentationsOpened, 'documentationsOpened is updated');
        const collapse = /** @type AnypointCollapseElement */ (title.nextElementSibling);
        assert.isFalse(collapse.opened, 'collapse is closed')
      });

      it('toggles schemas section', async () => {
        const title = /** @type HTMLElement */ (element.shadowRoot.querySelector('.schemas .section-title'));
        title.click();
        await nextFrame();
        // it is initially opened
        assert.isFalse(element.schemasOpened, 'schemasOpened is updated');
        const collapse = /** @type AnypointCollapseElement */ (title.nextElementSibling);
        assert.isFalse(collapse.opened, 'collapse is closed')
      });

      it('toggles security section', async () => {
        const title = /** @type HTMLElement */ (element.shadowRoot.querySelector('.security .section-title'));
        title.click();
        await nextFrame();
        // it is initially opened
        assert.isFalse(element.securityOpened, 'securityOpened is updated');
        const collapse = /** @type AnypointCollapseElement */ (title.nextElementSibling);
        assert.isFalse(collapse.opened, 'collapse is closed')
      });

      it('toggles custom properties section', async () => {
        const title = /** @type HTMLElement */ (element.shadowRoot.querySelector('.custom-properties .section-title'));
        title.click();
        await nextFrame();
        // it is initially opened
        assert.isFalse(element.customPropertiesOpened, 'customPropertiesOpened is updated');
        const collapse = /** @type AnypointCollapseElement */ (title.nextElementSibling);
        assert.isFalse(collapse.opened, 'collapse is closed')
      });
    });

    describe('Selecting items', () => {
      let element = /** @type GraphApiNavigationElement */ (null);
      beforeEach(async () => { element = await dataFixture() });

      it('selects the summary', async () => {
        const item = /** @type HTMLElement */ (element.shadowRoot.querySelector('.list-item.summary'));
        item.click();
        await nextFrame();
        assert.equal(element.selected, 'summary', 'selected is set');
        assert.equal(element.selectedType, 'summary', 'selectedType is set');
        assert.isTrue(element.selectedItem === item, 'selectedItem is set');
        assert.isTrue(item.classList.contains('selected'), 'the list item has the selected class');
      });

      it('selects an endpoint', async () => {
        const item = /** @type HTMLElement */ (element.shadowRoot.querySelector('.endpoint[data-path="/people"]'));
        item.click();
        await nextFrame();
        assert.equal(element.selected, item.dataset.graphId, 'selected is set');
        assert.equal(element.selectedType, 'endpoint', 'selectedType is set');
        assert.isTrue(element.selectedItem === item, 'selectedItem is set');
        assert.isTrue(item.classList.contains('selected'), 'the list item has the selected class');
      });

      it('selects an operation', async () => {
        const endpoint = /** @type HTMLElement */ (element.shadowRoot.querySelector('.endpoint[data-path="/people"]'));
        const collapse = /** @type AnypointCollapseElement */ (endpoint.nextElementSibling);
        const item = /** @type HTMLElement */ (collapse.querySelector('.list-item.operation'));
        item.click();
        await nextFrame();
        assert.equal(element.selected, item.dataset.graphId, 'selected is set');
        assert.equal(element.selectedType, 'operation', 'selectedType is set');
        assert.isTrue(element.selectedItem === item, 'selectedItem is set');
        assert.isTrue(item.classList.contains('selected'), 'the list item has the selected class');
      });

      it('selects a documentation', async () => {
        const item = /** @type HTMLElement */ (element.shadowRoot.querySelector('.documentation anypoint-collapse .list-item'));
        item.click();
        await nextFrame();
        assert.equal(element.selected, item.dataset.graphId, 'selected is set');
        assert.equal(element.selectedType, 'documentation', 'selectedType is set');
        assert.isTrue(element.selectedItem === item, 'selectedItem is set');
        assert.isTrue(item.classList.contains('selected'), 'the list item has the selected class');
      });

      it('selects a schema', async () => {
        const item = /** @type HTMLElement */ (element.shadowRoot.querySelector('.schemas anypoint-collapse .list-item'));
        item.click();
        await nextFrame();
        assert.equal(element.selected, item.dataset.graphId, 'selected is set');
        assert.equal(element.selectedType, 'schema', 'selectedType is set');
        assert.isTrue(element.selectedItem === item, 'selectedItem is set');
        assert.isTrue(item.classList.contains('selected'), 'the list item has the selected class');
      });

      it('selects a security', async () => {
        const item = /** @type HTMLElement */ (element.shadowRoot.querySelector('.security anypoint-collapse .list-item'));
        item.click();
        await nextFrame();
        assert.equal(element.selected, item.dataset.graphId, 'selected is set');
        assert.equal(element.selectedType, 'security', 'selectedType is set');
        assert.isTrue(element.selectedItem === item, 'selectedItem is set');
        assert.isTrue(item.classList.contains('selected'), 'the list item has the selected class');
      });

      it('selects a custom property', async () => {
        const item = /** @type HTMLElement */ (element.shadowRoot.querySelector('.custom-properties anypoint-collapse .list-item'));
        item.click();
        await nextFrame();
        assert.equal(element.selected, item.dataset.graphId, 'selected is set');
        assert.equal(element.selectedType, 'custom-property', 'selectedType is set');
        assert.isTrue(element.selectedItem === item, 'selectedItem is set');
        assert.isTrue(item.classList.contains('selected'), 'the list item has the selected class');
      });

      it('deselects previously selected item', async () => {
        const security = /** @type HTMLElement */ (element.shadowRoot.querySelector('.security anypoint-collapse .list-item'));
        security.click();
        await nextFrame();
        const schema = /** @type HTMLElement */ (element.shadowRoot.querySelector('.schemas anypoint-collapse .list-item'));
        schema.click();
        await nextFrame();
        assert.isFalse(security.classList.contains('selected'));
      });
    });

    describe('select()', () => {
      let element = /** @type GraphApiNavigationElement */ (null);
      beforeEach(async () => { element = await dataFixture() });

      it('selects an item via the "select()" method', async () => {
        const security = /** @type HTMLElement */ (element.shadowRoot.querySelector('.security anypoint-collapse .list-item'));
        const { graphId } = security.dataset;
        element.select(graphId);
        await nextFrame();
        assert.equal(element.selected, graphId, 'selected is set');
        assert.isTrue(security.classList.contains('selected'), 'the list item has the selected class');
      });

      it('ignores selection when no argument', async () => {
        element.select(undefined);
        await nextFrame();
        assert.equal(element.selected, undefined);
      });

      it('ignores selection when no menu item', async () => {
        element.select('some');
        await nextFrame();
        assert.equal(element.selected, undefined);
      });
    });

    describe('Filtering', () => {
      let element = /** @type GraphApiNavigationElement */ (null);
      beforeEach(async () => { element = await dataFixture() });

      it('queries endpoints', async () => {
        element.query = '/orgs';
        await nextFrame();
        const items = element.shadowRoot.querySelectorAll('.list-item.endpoint');
        assert.lengthOf(items, 4, 'has only endpoints with /orgs path');
      });

      it('queries operations', async () => {
        element.query = 'remove a person';
        await nextFrame();
        const items = element.shadowRoot.querySelectorAll('.list-item.endpoint');
        assert.lengthOf(items, 1, 'has only the /people/{personId} endpoint');
        const collapse = items[0].nextElementSibling;
        const ops = collapse.querySelectorAll('.list-item.operation');
        assert.lengthOf(ops, 1, 'has only the DELETE operation');
      });

      it('queries documentation', async () => {
        element.query = 'headline';
        await nextFrame();
        const items = element.shadowRoot.querySelectorAll('.list-item.documentation');
        assert.lengthOf(items, 1, 'has only the Headline documentation');
      });

      it('queries schemas', async () => {
        element.query = 'error';
        await nextFrame();
        const items = element.shadowRoot.querySelectorAll('.list-item.schema');
        assert.lengthOf(items, 1, 'has only the ErrorResource schema');
      });

      it('queries security', async () => {
        element.query = 'oAuth';
        await nextFrame();
        const items = element.shadowRoot.querySelectorAll('.list-item.security');
        assert.lengthOf(items, 1, 'has only the OAuth2.0 security');
      });

      it('queries custom properties', async () => {
        element.query = 'depr';
        await nextFrame();
        const items = element.shadowRoot.querySelectorAll('.list-item.custom-property');
        assert.lengthOf(items, 1, 'has only the deprecated item');
      });

      it('Filters from the search input (search event)', async () => {
        const input = /** @type HTMLInputElement */ (element.shadowRoot.querySelector('.filter-wrapper input'));
        input.value = 'oAuth';
        input.dispatchEvent(new Event('search'));
        await nextFrame();
        const items = element.shadowRoot.querySelectorAll('.list-item.security');
        assert.lengthOf(items, 1, 'has only the OAuth2.0 security');
      });

      it('Filters from the search input (change event)', async () => {
        const input = /** @type HTMLInputElement */ (element.shadowRoot.querySelector('.filter-wrapper input'));
        input.value = 'oAuth';
        input.dispatchEvent(new Event('change'));
        await nextFrame();
        const items = element.shadowRoot.querySelectorAll('.list-item.security');
        assert.lengthOf(items, 1, 'has only the OAuth2.0 security');
      });

      it('clears the filtered results when removing the input value', async () => {
        const input = /** @type HTMLInputElement */ (element.shadowRoot.querySelector('.filter-wrapper input'));
        input.value = 'oAuth';
        input.dispatchEvent(new Event('change'));
        await nextFrame();
        input.value = '';
        input.dispatchEvent(new Event('change'));
        await nextFrame();
        const items = element.shadowRoot.querySelectorAll('.list-item.security');
        assert.lengthOf(items, 3, 'has all security');
      });
    });

    describe('No sorting', () => {
      let element = /** @type GraphApiNavigationElement */ (null);
      before(async () => { element = await noSortingFixture() });

      it('creates the flat tree', () => {
        const endpoints = element[endpointsValue];
        assert.lengthOf(endpoints, 14, 'has all endpoints');
      });

      it('has the name paths', () => {
        const endpoints = element[endpointsValue];
        assert.equal(endpoints[3].label, 'A person');
        // assert.equal(endpoints[3].label, endpoints[3].path);
      });

      it('has the default indent', () => {
        const endpoints = element[endpointsValue];
        assert.equal(endpoints[0].indent, 0);
      });
    });

    describe('querying API data', () => {
      let element = /** @type GraphApiNavigationElement */ (null);
      beforeEach(async () => { element = await noSortingFixture() });

      it('sets the [isAsyncValue]', async () => {
        element[isAsyncValue] = undefined;
        const ctrl = new AbortController();
        await element[queryApi](ctrl.signal);
        assert.isFalse(element[isAsyncValue]);
      });

      it('ignores setting values when signal aborted', async () => {
        element[isAsyncValue] = undefined;
        const ctrl = new AbortController();
        const p = element[queryApi](ctrl.signal);
        ctrl.abort();
        await p;
        assert.isUndefined(element[isAsyncValue]);
      });

      it('dispatches error event when query error', async () => {
        element.addEventListener(StoreEventTypes.Api.get, 
          /**
           * @param {CustomEvent} e 
           */
          function f(e) {
            element.removeEventListener(StoreEventTypes.Api.get, f);
            e.stopPropagation();
            e.preventDefault();
            e.detail.result = Promise.reject(new Error('test'));
          });
        const spy = sinon.spy();
        element.addEventListener(ReportingEventTypes.error, spy);
        const ctrl = new AbortController();
        await element[queryApi](ctrl.signal);
        assert.isTrue(spy.called);
      });
    });

    describe('querying API data', () => {
      let element = /** @type GraphApiNavigationElement */ (null);
      beforeEach(async () => { element = await noSortingFixture() });

      it('sets the [endpointsValue]', async () => {
        element[endpointsValue] = undefined;
        const ctrl = new AbortController();
        await element[queryEndpoints](ctrl.signal);
        assert.typeOf(element[endpointsValue], 'array');
      });

      it('ignores setting values when signal aborted', async () => {
        element[endpointsValue] = undefined;
        const ctrl = new AbortController();
        const p = element[queryEndpoints](ctrl.signal);
        ctrl.abort();
        await p;
        assert.isUndefined(element[endpointsValue]);
      });

      it('ignores setting values when signal aborted (pre-execution)', async () => {
        element[endpointsValue] = undefined;
        const ctrl = new AbortController();
        ctrl.abort();
        await element[queryEndpoints](ctrl.signal);
        assert.isUndefined(element[endpointsValue]);
      });

      it('dispatches error event when query error', async () => {
        element.addEventListener(StoreEventTypes.Endpoint.listWithOperations, 
          /**
           * @param {CustomEvent} e 
           */
          function f(e) {
            element.removeEventListener(StoreEventTypes.Endpoint.listWithOperations, f);
            e.stopPropagation();
            e.preventDefault();
            e.detail.result = Promise.reject(new Error('test'));
          });
        const spy = sinon.spy();
        element.addEventListener(ReportingEventTypes.error, spy);
        const ctrl = new AbortController();
        await element[queryEndpoints](ctrl.signal);
        assert.isTrue(spy.called);
      });
    });

    describe('querying the documentation data', () => {
      let element = /** @type GraphApiNavigationElement */ (null);
      beforeEach(async () => { element = await noSortingFixture() });

      it('sets the [documentationsValue]', async () => {
        element[documentationsValue] = undefined;
        const ctrl = new AbortController();
        await element[queryDocumentations](ctrl.signal);
        assert.typeOf(element[documentationsValue], 'array');
      });

      it('ignores setting values when signal aborted', async () => {
        element[documentationsValue] = undefined;
        const ctrl = new AbortController();
        const p = element[queryDocumentations](ctrl.signal);
        ctrl.abort();
        await p;
        assert.isUndefined(element[documentationsValue]);
      });

      it('ignores setting values when signal aborted (pre-execution)', async () => {
        element[documentationsValue] = undefined;
        const ctrl = new AbortController();
        ctrl.abort();
        await element[queryDocumentations](ctrl.signal);
        assert.isUndefined(element[documentationsValue]);
      });

      it('dispatches error event when query error', async () => {
        element.addEventListener(StoreEventTypes.Documentation.list, 
          /**
           * @param {CustomEvent} e 
           */
          function f(e) {
            element.removeEventListener(StoreEventTypes.Documentation.list, f);
            e.stopPropagation();
            e.preventDefault();
            e.detail.result = Promise.reject(new Error('test'));
          });
        const spy = sinon.spy();
        element.addEventListener(ReportingEventTypes.error, spy);
        const ctrl = new AbortController();
        await element[queryDocumentations](ctrl.signal);
        assert.isTrue(spy.called);
      });
    });

    describe('querying the schema data', () => {
      let element = /** @type GraphApiNavigationElement */ (null);
      beforeEach(async () => { element = await noSortingFixture() });

      it('sets the [schemasValue]', async () => {
        element[schemasValue] = undefined;
        const ctrl = new AbortController();
        await element[querySchemas](ctrl.signal);
        assert.typeOf(element[schemasValue], 'array');
      });

      it('ignores setting values when signal aborted', async () => {
        element[schemasValue] = undefined;
        const ctrl = new AbortController();
        const p = element[querySchemas](ctrl.signal);
        ctrl.abort();
        await p;
        assert.isUndefined(element[schemasValue]);
      });

      it('ignores setting values when signal aborted (pre-execution)', async () => {
        element[schemasValue] = undefined;
        const ctrl = new AbortController();
        ctrl.abort();
        await element[querySchemas](ctrl.signal);
        assert.isUndefined(element[schemasValue]);
      });

      it('dispatches error event when query error', async () => {
        element.addEventListener(StoreEventTypes.Type.list, 
          /**
           * @param {CustomEvent} e 
           */
          function f(e) {
            element.removeEventListener(StoreEventTypes.Type.list, f);
            e.stopPropagation();
            e.preventDefault();
            e.detail.result = Promise.reject(new Error('test'));
          });
        const spy = sinon.spy();
        element.addEventListener(ReportingEventTypes.error, spy);
        const ctrl = new AbortController();
        await element[querySchemas](ctrl.signal);
        assert.isTrue(spy.called);
      });
    });

    describe('querying the security data', () => {
      let element = /** @type GraphApiNavigationElement */ (null);
      beforeEach(async () => { element = await noSortingFixture() });

      it('sets the [securityValue]', async () => {
        element[securityValue] = undefined;
        const ctrl = new AbortController();
        await element[querySecurity](ctrl.signal);
        assert.typeOf(element[securityValue], 'array');
      });

      it('ignores setting values when signal aborted', async () => {
        element[securityValue] = undefined;
        const ctrl = new AbortController();
        const p = element[querySecurity](ctrl.signal);
        ctrl.abort();
        await p;
        assert.isUndefined(element[securityValue]);
      });

      it('ignores setting values when signal aborted (pre-execution)', async () => {
        element[securityValue] = undefined;
        const ctrl = new AbortController();
        ctrl.abort();
        await element[querySecurity](ctrl.signal);
        assert.isUndefined(element[securityValue]);
      });

      it('dispatches error event when query error', async () => {
        element.addEventListener(StoreEventTypes.Security.list, 
          /**
           * @param {CustomEvent} e 
           */
          function f(e) {
            element.removeEventListener(StoreEventTypes.Security.list, f);
            e.stopPropagation();
            e.preventDefault();
            e.detail.result = Promise.reject(new Error('test'));
          });
        const spy = sinon.spy();
        element.addEventListener(ReportingEventTypes.error, spy);
        const ctrl = new AbortController();
        await element[querySecurity](ctrl.signal);
        assert.isTrue(spy.called);
      });
    });

    describe('querying the custom data', () => {
      let element = /** @type GraphApiNavigationElement */ (null);
      beforeEach(async () => { element = await noSortingFixture() });

      it('sets the [customPropertiesValue]', async () => {
        element[customPropertiesValue] = undefined;
        const ctrl = new AbortController();
        await element[queryCustomProperties](ctrl.signal);
        assert.typeOf(element[customPropertiesValue], 'array');
      });

      it('ignores setting values when signal aborted', async () => {
        element[customPropertiesValue] = undefined;
        const ctrl = new AbortController();
        const p = element[queryCustomProperties](ctrl.signal);
        ctrl.abort();
        await p;
        assert.isUndefined(element[customPropertiesValue]);
      });

      it('ignores setting values when signal aborted (pre-execution)', async () => {
        element[customPropertiesValue] = undefined;
        const ctrl = new AbortController();
        ctrl.abort();
        await element[queryCustomProperties](ctrl.signal);
        assert.isUndefined(element[customPropertiesValue]);
      });

      it('ignores querying when no customProperties', async () => {
        element.customProperties = false;
        const ctrl = new AbortController();
        await element[queryCustomProperties](ctrl.signal);
        assert.isUndefined(element[customPropertiesValue]);
      });

      it('dispatches error event when query error', async () => {
        element.addEventListener(StoreEventTypes.CustomProperty.list, 
          /**
           * @param {CustomEvent} e 
           */
          function f(e) {
            element.removeEventListener(StoreEventTypes.CustomProperty.list, f);
            e.stopPropagation();
            e.preventDefault();
            e.detail.result = Promise.reject(new Error('test'));
          });
        const spy = sinon.spy();
        element.addEventListener(ReportingEventTypes.error, spy);
        const ctrl = new AbortController();
        await element[queryCustomProperties](ctrl.signal);
        assert.isTrue(spy.called);
      });
    });

    describe('keyboard navigation', () => {
      let element = /** @type GraphApiNavigationElement */ (null);
      beforeEach(async () => { element = await dataFixture() });

      it('focuses on the summary when menu is focused', async () => {
        element.focus();
        await nextFrame()
        const node = element.shadowRoot.querySelector('.summary .list-item');
        assert.equal(element.focusedItem, node, 'element.focusedItem is the summary');
      });

      it('focuses on the endpoints when menu is focused and no summary', async () => {
        element.summary = false;
        await nextFrame()
        element.focus();
        await nextFrame()
        const node = element.shadowRoot.querySelector('.endpoints .section-title');
        assert.equal(element.focusedItem, node, 'element.focusedItem is first item');
      });

      it('selected item gets focus when menu is focused', async () => {
        const node = /** @type HTMLElement */ (element.shadowRoot.querySelector('.list-item.operation'));
        node.click();
        window.focus();
        await nextFrame();
        element.focus();
        assert.equal(element.focusedItem, node, 'element.focusedItem is first item');
      });

      it('focuses on the previous item on up keydown', async () => {
        element.focus();
        await nextFrame();
        // Key press up
        element.dispatchEvent(new KeyboardEvent('keydown', {
          bubbles: true,
          cancelable: true,
          keyCode: 38,
          key: 'ArrowUp',
          code: 'ArrowUp',
        }));
        await nextFrame();
        const node = element.shadowRoot.querySelectorAll('.security .list-item.security')[2];
        assert.equal(element.focusedItem, node, 'element.focusedItem is last item');
      });

      it('focuses on the next item on down keydown', async () => {
        element.focus();
        await nextFrame();
        // Key press down
        element.dispatchEvent(new KeyboardEvent('keydown', {
          bubbles: true,
          cancelable: true,
          keyCode: 40,
          key: 'ArrowDown',
          code: 'ArrowDown',
        }));
        await nextFrame();
        const node = element.shadowRoot.querySelector('.endpoints > .section-title');
        assert.equal(element.focusedItem, node, 'element.focusedItem is last item');
      });

      it('keyboard events should not bubble', async () => {
        let keyCounter = 0;
        element.parentElement.addEventListener('keydown', event => {
          if (event.key === 'Escape') {
            keyCounter++;
          }
          if (event.key === 'ArrowUp') {
            keyCounter++;
          }
          if (event.key === 'ArrowDown') {
            keyCounter++;
          }
        });
        // up
        element.dispatchEvent(new KeyboardEvent('keydown', {
          bubbles: true,
          cancelable: true,
          keyCode: 40,
          key: 'ArrowDown',
          code: 'ArrowDown',
        }));
        // down
        element.dispatchEvent(new KeyboardEvent('keydown', {
          bubbles: true,
          cancelable: true,
          keyCode: 38,
          key: 'ArrowUp',
          code: 'ArrowUp',
        }));
        // esc
        element.dispatchEvent(new KeyboardEvent('keydown', {
          bubbles: true,
          cancelable: true,
          keyCode: 27,
          key: 'Escape',
          code: 'Escape',
        }));
        await nextFrame();
        assert.equal(keyCounter, 0);
      });

      it('selects an operation item with the space bar', () => {
        const node = /** @type HTMLElement */ (element.shadowRoot.querySelector('.list-item.operation'));
        node.dispatchEvent(new KeyboardEvent('keydown', {
          bubbles: true,
          cancelable: true,
          composed: true,
          keyCode: 32,
          key: ' ',
          code: 'Space',
        }));
        assert.equal(element.selected, node.dataset.graphId);
      });

      it('selects an operation item with the Enter', () => {
        const node = /** @type HTMLElement */ (element.shadowRoot.querySelector('.list-item.operation'));
        node.dispatchEvent(new KeyboardEvent('keydown', {
          bubbles: true,
          cancelable: true,
          composed: true,
          keyCode: 13,
          key: 'Enter',
          code: 'Enter',
        }));
        assert.equal(element.selected, node.dataset.graphId);
      });

      it('selects an endpoint with space bar', async() => {
        const node = /** @type HTMLElement */ (element.shadowRoot.querySelector('.list-item.endpoint'));
        node.dispatchEvent(new KeyboardEvent('keydown', {
          bubbles: true,
          cancelable: true,
          composed: true,
          keyCode: 32,
          key: ' ',
          code: 'Space',
        }));
        assert.equal(element.selected, node.dataset.graphId);
      });

      it('opens an endpoint when arrow right', async() => {
        const node = /** @type HTMLElement */ (element.shadowRoot.querySelector('.list-item.endpoint'));
        node.dispatchEvent(new KeyboardEvent('keydown', {
          bubbles: true,
          cancelable: true,
          composed: true,
          keyCode: 39,
          key: 'ArrowRight',
          code: 'ArrowRight',
        }));
        await nextFrame();
        const collapse = /** @type AnypointCollapseElement */ (node.nextElementSibling);
        assert.isTrue(collapse.opened);
      });

      it('closes an endpoint when arrow left', async() => {
        const node = /** @type HTMLElement */ (element.shadowRoot.querySelector('.list-item.endpoint'));
        node.dispatchEvent(new KeyboardEvent('keydown', {
          bubbles: true,
          cancelable: true,
          composed: true,
          keyCode: 39,
          key: 'ArrowRight',
          code: 'ArrowRight',
        }));
        await nextFrame();
        node.dispatchEvent(new KeyboardEvent('keydown', {
          bubbles: true,
          cancelable: true,
          composed: true,
          keyCode: 37,
          key: 'ArrowLeft',
          code: 'ArrowLeft',
        }));
        await nextFrame();
        const collapse = /** @type AnypointCollapseElement */ (node.nextElementSibling);
        assert.isFalse(collapse.opened);
      });

      it('toggles a section with space bar', async() => {
        const node = /** @type HTMLElement */ (element.shadowRoot.querySelector('.endpoints .section-title'));
        node.dispatchEvent(new KeyboardEvent('keydown', {
          bubbles: true,
          cancelable: true,
          composed: true,
          keyCode: 32,
          key: ' ',
          code: 'Space',
        }));
        await nextFrame();
        const collapse = /** @type AnypointCollapseElement */ (node.nextElementSibling);
        // initially opened
        assert.isFalse(collapse.opened);
      });

      it('removes focus on shift+tab', async () => {
        element.focus();
        await nextFrame();
        // Key press 'Tab'
        element.dispatchEvent(new KeyboardEvent('keydown', {
          bubbles: true,
          cancelable: true,
          composed: true,
          keyCode: 9,
          key: 'Tab',
          code: 'Tab',
          shiftKey: true,
        }));
        assert.equal(element.getAttribute('tabindex'), '-1');
        assert.isTrue(element[shiftTabPressedValue]);
        assert.equal(element[focusedItemValue], null);
        await aTimeout(1);
        assert.isFalse(element[shiftTabPressedValue]);
        assert.equal(element.getAttribute('tabindex'), '0');
      });
    });

    describe('expandAll()', () => {
      let element = /** @type GraphApiNavigationElement */ (null);
      beforeEach(async () => { element = await basicDataFixture() });

      it('sets all sections opened', () => {
        element.expandAll();
        assert.isTrue(element.endpointsOpened, 'endpointsOpened is set');
        assert.isTrue(element.schemasOpened, 'schemasOpened is set');
        assert.isTrue(element.securityOpened, 'securityOpened is set');
        assert.isTrue(element.documentationsOpened, 'documentationsOpened is set');
      });

      it('calls expandAllEndpoints()', () => {
        const spy = sinon.spy(element, 'expandAllEndpoints');
        element.expandAll();
        assert.isTrue(spy.called);
      });
    });

    describe('collapseAll()', () => {
      let element = /** @type GraphApiNavigationElement */ (null);
      beforeEach(async () => { element = await noSortingFixture() });

      it('sets all sections opened', () => {
        element.collapseAll();
        assert.isFalse(element.endpointsOpened, 'endpointsOpened is set');
        assert.isFalse(element.schemasOpened, 'schemasOpened is set');
        assert.isFalse(element.securityOpened, 'securityOpened is set');
        assert.isFalse(element.documentationsOpened, 'documentationsOpened is set');
      });

      it('calls collapseAllEndpoints()', () => {
        const spy = sinon.spy(element, 'collapseAllEndpoints');
        element.collapseAll();
        assert.isTrue(spy.called);
      });
    });

    describe('expandAllEndpoints()', () => {
      let element = /** @type GraphApiNavigationElement */ (null);
      beforeEach(async () => { element = await basicDataFixture() });

      it('sets endpointsOpened', () => {
        element.expandAllEndpoints();
        assert.isTrue(element.endpointsOpened);
      });

      it('sets the [openedEndpointsValue]', () => {
        element.expandAllEndpoints();
        assert.lengthOf(element[openedEndpointsValue], 14);
      });

      it('requests template update', () => {
        const spy = sinon.spy(element, 'requestUpdate');
        element.expandAllEndpoints();
        assert.isTrue(spy.called);
      });
    });

    describe('collapseAllEndpoints()', () => {
      let element = /** @type GraphApiNavigationElement */ (null);
      beforeEach(async () => { element = await basicDataFixture() });

      it('re-sets the [openedEndpointsValue]', () => {
        element[openedEndpointsValue] = ['test'];
        element.collapseAllEndpoints();
        assert.deepEqual(element[openedEndpointsValue], []);
      });

      it('requests template update', () => {
        const spy = sinon.spy(element, 'requestUpdate');
        element.collapseAllEndpoints();
        assert.isTrue(spy.called);
      });
    });
  });
});
