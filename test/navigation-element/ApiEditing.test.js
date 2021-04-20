import { fixture, assert, html } from '@open-wc/testing';
import { AmfStoreService, StoreEventTypes, StoreEvents } from '@api-client/amf-store';
import { nextFrame, oneEvent } from '@open-wc/testing-helpers';
import '../../graph-api-navigation.js';
import { 
  addingEndpointValue,
} from '../../src/GraphApiNavigationElement.js';

/** @typedef {import('@anypoint-web-components/anypoint-collapse').AnypointCollapseElement} AnypointCollapseElement */
/** @typedef {import('../..').GraphApiNavigationElement} GraphApiNavigationElement */
/** @typedef {import('../..').APIExternalNavigationEvent} APIExternalNavigationEvent */

describe('GraphApiNavigationElement', () => {
  let store = /** @type AmfStoreService */ (null);
  before(async () => {
    store = new AmfStoreService(window, {
      amfLocation: '/node_modules/@api-client/amf-store/amf-bundle.js',
    });
    await store.init();
    await store.createWebApi({});
  });

  describe('Editing API model', () => {
    /**
     * @returns {Promise<GraphApiNavigationElement>}
     */
    async function dataFixture() {
      const elm = /** @type GraphApiNavigationElement */ (await fixture(html`
        <graph-api-navigation edit manualQuery></graph-api-navigation>
      `));
      await elm.queryGraph();
      // await oneEvent(elm, 'graphload');
      await nextFrame();
      return elm;
    }

    describe('Endpoints editing', () => {
      describe('Data rendering', () => {
        let element = /** @type GraphApiNavigationElement */ (null);
        before(async () => { element = await dataFixture() });

        it('renders the section title without endpoints', () => {
          const title = element.shadowRoot.querySelector('.endpoints .section-title');
          assert.ok(title);
        });

        it('renders the empty info', () => {
          const p = element.shadowRoot.querySelector('.endpoints .empty-section');
          assert.ok(p, 'has the info');
          assert.equal(p.textContent.trim(), 'No endpoints in this API');
        });
      });
      
      describe('Adding an endpoint', () => {
        let element = /** @type GraphApiNavigationElement */ (null);
        beforeEach(async () => { 
          await store.createWebApi({});
          element = await dataFixture() 
        });

        it('opens the endpoints when no opened', async () => {
          await element.addEndpoint();
          assert.isTrue(element.endpointsOpened);
        });

        it('sets the [addingEndpointValue]', async () => {
          await element.addEndpoint();
          assert.isTrue(element[addingEndpointValue]);
        });


        it('renders the input element inside the endpoints', async () => {
          await element.addEndpoint();
          const input = element.shadowRoot.querySelector('.add-endpoint-input input');
          assert.ok(input);
        });

        it('focuses on the input', async () => {
          await element.addEndpoint();
          const input = element.shadowRoot.querySelector('.add-endpoint-input input');
          assert.isTrue(element.shadowRoot.activeElement === input, 'has focus in the shadow DOM');
        });

        it('cancels the endpoint editing on input Escape', async () => {
          await element.addEndpoint();
          const input = /** @type HTMLInputElement */ (element.shadowRoot.querySelector('.add-endpoint-input input'));
          input.value = 'test';
          input.dispatchEvent(new KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            composed: true,
            key: 'Escape',
            code: 'Escape',
          }));
          assert.isFalse(element[addingEndpointValue], 'sets the [addingEndpointValue] property');
          await nextFrame();
          const node = /** @type HTMLInputElement */ (element.shadowRoot.querySelector('.add-endpoint-input'));
          assert.notOk(node, 'input is not in the DOM')
        });

        it('adds new endpoint on enter', async () => {
          await element.addEndpoint();
          const input = /** @type HTMLInputElement */ (element.shadowRoot.querySelector('.add-endpoint-input input'));
          input.value = '/test-endpoint';
          input.dispatchEvent(new KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            composed: true,
            key: 'Enter',
            code: 'Enter',
          }));
          const e = await oneEvent(window, StoreEventTypes.Endpoint.State.created);
          assert.equal(e.detail.item.path, '/test-endpoint', 'created the endpoint');
        });

        it('renders added endpoint on enter', async () => {
          await element.addEndpoint();
          const input = /** @type HTMLInputElement */ (element.shadowRoot.querySelector('.add-endpoint-input input'));
          input.value = '/test-endpoint';
          input.dispatchEvent(new KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            composed: true,
            key: 'Enter',
            code: 'Enter',
          }));
          await oneEvent(window, StoreEventTypes.Endpoint.State.created);
          await nextFrame();
          const node = element.shadowRoot.querySelector('.endpoints .list-item');
          assert.ok(node, 'has the item');
          assert.equal(node.textContent.trim(), '/test-endpoint', 'renders the path');
        });
      });

      describe('Editing an endpoint', () => {
        let element = /** @type GraphApiNavigationElement */ (null);
        const path = '/endpoint-path';
        const name = '/initial-name';
        let created;

        beforeEach(async () => {
          await store.createWebApi({});
          created = await StoreEvents.Endpoint.add(window, { path, name, });
          element = await dataFixture();
        });

        it('renders the input instead of list item', async () => {
          await element.renameAction(created.id);
          const input = /** @type HTMLInputElement */ (element.shadowRoot.querySelector(`input[data-id="${created.id}"]`));
          assert.ok(input, 'has the input');
        });

        it('removes the input when Escape', async () => {
          await element.renameAction(created.id);
          const input = /** @type HTMLInputElement */ (element.shadowRoot.querySelector(`input[data-id="${created.id}"]`));
          input.value = 'test';
          input.dispatchEvent(new KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            composed: true,
            key: 'Escape',
            code: 'Escape',
          }));
          await nextFrame();
          const node = /** @type HTMLInputElement */ (element.shadowRoot.querySelector(`input[data-id="${created.id}"]`));
          assert.notOk(node, 'input is not in the DOM')
        });

        it('updates the endpoint on enter', async () => {
          await element.renameAction(created.id);
          const input = /** @type HTMLInputElement */ (element.shadowRoot.querySelector(`input[data-id="${created.id}"]`));
          input.value = 'updated';
          input.dispatchEvent(new KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            composed: true,
            key: 'Enter',
            code: 'Enter',
          }));
          const e = await oneEvent(window, StoreEventTypes.Endpoint.State.updated);
          assert.equal(e.detail.item.name, 'updated', 'updates the name');
        });

        it('renders new name after input closes', async () => {
          await element.renameAction(created.id);
          const input = /** @type HTMLInputElement */ (element.shadowRoot.querySelector(`input[data-id="${created.id}"]`));
          input.value = 'updated';
          input.dispatchEvent(new KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            composed: true,
            key: 'Enter',
            code: 'Enter',
          }));
          // after endpoint update it queries for the new list.
          const e = await oneEvent(element, StoreEventTypes.Endpoint.listWithOperations);
          await e.detail.result;
          await nextFrame();
          const node = element.shadowRoot.querySelector('.endpoints .list-item');
          assert.equal(node.textContent.trim(), 'updated', 'renders the name');
        });
      });

      describe('Deleting an endpoint', () => {
        let element = /** @type GraphApiNavigationElement */ (null);
        const path = '/endpoint-path';
        const name = '/initial-name';
        let created;

        beforeEach(async () => {
          await store.createWebApi({});
          created = await StoreEvents.Endpoint.add(window, { path, name, });
          element = await dataFixture();
        });

        it('removes the endpoint from the list', async () => {
          StoreEvents.Endpoint.delete(window, created.id);
          // after endpoint delete it queries for the new list.
          const e = await oneEvent(element, StoreEventTypes.Endpoint.listWithOperations);
          await e.detail.result;
          await nextFrame();
          const node = element.shadowRoot.querySelector('.endpoints .list-item');
          assert.notOk(node);
        });
      });
    });

    describe('Operation editing', () => {
      describe('Adding an operation', () => {
        let element = /** @type GraphApiNavigationElement */ (null);
        let created;
        beforeEach(async () => {
          await store.createWebApi({});
          created = await StoreEvents.Endpoint.add(window, { path: '/test' });
          element = await dataFixture();
        });

        it('renders endpoint without children', () => {
          const mock = element.shadowRoot.querySelector('.endpoints .list-item .endpoint-toggle-mock');
          assert.ok(mock);
        });

        it('renders the operation with method only', async () => {
          const op = await StoreEvents.Operation.add(window, created.id, { method: 'get' });
          await nextFrame();
          const node = element.shadowRoot.querySelector('.list-item.operation');
          assert.equal(node.textContent.trim(), 'get', 'has the label');
          assert.equal(node.getAttribute('data-graph-id'), op.id);
        });

        it('renders the operation with method and name', async () => {
          await StoreEvents.Operation.add(window, created.id, { method: 'get', name: 'Test' });
          await nextFrame();
          const node = element.shadowRoot.querySelector('.list-item.operation');
          assert.include(node.textContent.trim(), 'Test', 'has the label');
        });
      });

      describe('Renaming an operation', () => {
        let element = /** @type GraphApiNavigationElement */ (null);
        const path = '/endpoint-path';
        const name = '/initial-name';
        let created;

        beforeEach(async () => {
          await store.createWebApi({});
          const endpoint = await StoreEvents.Endpoint.add(window, { path, name, });
          created = await StoreEvents.Operation.add(window, endpoint.id, { method: 'get' });
          element = await dataFixture();
        });

        it('renders the input instead of list item', async () => {
          await element.renameAction(created.id);
          const input = /** @type HTMLInputElement */ (element.shadowRoot.querySelector(`input[data-id="${created.id}"]`));
          assert.ok(input, 'has the input');
        });

        it('removes the input when Escape', async () => {
          await element.renameAction(created.id);
          const input = /** @type HTMLInputElement */ (element.shadowRoot.querySelector(`input[data-id="${created.id}"]`));
          input.value = 'test';
          input.dispatchEvent(new KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            composed: true,
            key: 'Escape',
            code: 'Escape',
          }));
          await nextFrame();
          const node = /** @type HTMLInputElement */ (element.shadowRoot.querySelector(`input[data-id="${created.id}"]`));
          assert.notOk(node, 'input is not in the DOM')
        });

        it('updates the operation on enter', async () => {
          await element.renameAction(created.id);
          const input = /** @type HTMLInputElement */ (element.shadowRoot.querySelector(`input[data-id="${created.id}"]`));
          input.value = 'updated';
          input.dispatchEvent(new KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            composed: true,
            key: 'Enter',
            code: 'Enter',
          }));
          const e = await oneEvent(window, StoreEventTypes.Operation.State.updated);
          assert.equal(e.detail.item.name, 'updated', 'updates the name');
        });
      });

      describe('Deleting an operation', () => {
        let element = /** @type GraphApiNavigationElement */ (null);
        const path = '/endpoint-path';
        const name = '/initial-name';
        let created;

        beforeEach(async () => {
          await store.createWebApi({});
          const endpoint = await StoreEvents.Endpoint.add(window, { path, name, });
          created = await StoreEvents.Operation.add(window, endpoint.id, { method: 'get' });
          element = await dataFixture();
        });

        it('removed the operation when deleted', async () => {
          await StoreEvents.Operation.delete(window, created.id);
          await nextFrame();
          const node = element.shadowRoot.querySelector('.list-item.operation');
          assert.notOk(node);
        });
      });
    });
  });
});
