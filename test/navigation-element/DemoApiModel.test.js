import { fixture, assert, html } from '@open-wc/testing';
import { AmfStoreService } from '@api-client/amf-store';
import { nextFrame, oneEvent } from '@open-wc/testing-helpers';
import { AmfLoader } from '../helpers/AmfLoader.js';
import '../../graph-api-navigation.js';
import { 
  openedEndpointsValue,
} from '../../src/GraphApiNavigationElement.js';

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
          schemesOpened
          securityOpened></graph-api-navigation>
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

      it('has the schemes', () => {
        const panel = element.shadowRoot.querySelector('.schemes');
        assert.ok(panel);
      });
      
      it('opens the schemes section', () => {
        const panel = /** @type AnypointCollapseElement */ (element.shadowRoot.querySelector('.schemes anypoint-collapse'));
        assert.isTrue(panel.opened);
      });

      it('has the schemes items', () => {
        const items = element.shadowRoot.querySelectorAll('.schemes .list-item');
        assert.lengthOf(items, 6);
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
        const title = /** @type HTMLElement */ (element.shadowRoot.querySelector('.schemes .section-title'));
        title.click();
        await nextFrame();
        // it is initially opened
        assert.isFalse(element.schemesOpened, 'schemesOpened is updated');
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
      });

      it('selects an endpoint', async () => {
        const item = /** @type HTMLElement */ (element.shadowRoot.querySelector('.endpoint[data-path="/people"]'));
        item.click();
        await nextFrame();
        assert.equal(element.selected, item.dataset.graphId, 'selected is set');
        assert.equal(element.selectedType, 'endpoint', 'selectedType is set');
        assert.isTrue(element.selectedItem === item, 'selectedItem is set');
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
      });

      it('selects a documentation', async () => {
        const item = /** @type HTMLElement */ (element.shadowRoot.querySelector('.documentation anypoint-collapse .list-item'));
        item.click();
        await nextFrame();
        assert.equal(element.selected, item.dataset.graphId, 'selected is set');
        assert.equal(element.selectedType, 'documentation', 'selectedType is set');
        assert.isTrue(element.selectedItem === item, 'selectedItem is set');
      });

      it('selects a schema', async () => {
        const item = /** @type HTMLElement */ (element.shadowRoot.querySelector('.schemes anypoint-collapse .list-item'));
        item.click();
        await nextFrame();
        assert.equal(element.selected, item.dataset.graphId, 'selected is set');
        assert.equal(element.selectedType, 'schema', 'selectedType is set');
        assert.isTrue(element.selectedItem === item, 'selectedItem is set');
      });

      it('selects a security', async () => {
        const item = /** @type HTMLElement */ (element.shadowRoot.querySelector('.security anypoint-collapse .list-item'));
        item.click();
        await nextFrame();
        assert.equal(element.selected, item.dataset.graphId, 'selected is set');
        assert.equal(element.selectedType, 'security', 'selectedType is set');
        assert.isTrue(element.selectedItem === item, 'selectedItem is set');
      });
    });
  });
});
