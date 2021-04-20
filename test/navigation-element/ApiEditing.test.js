import { fixture, assert, html } from '@open-wc/testing';
import { AmfStoreService, StoreEventTypes, StoreEvents } from '@api-client/amf-store';
import { nextFrame, oneEvent } from '@open-wc/testing-helpers';
import { ns } from '@api-components/amf-helper-mixin/src/Namespace.js';
import '../../graph-api-navigation.js';
import { 
  addingEndpointValue,
  addingDocumentationValue,
  addingExternalValue,
  addingSchemaValue,
  addingSchemaTypeValue,
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

    describe('Documentations editing', () => {
      describe('Data rendering', () => {
        let element = /** @type GraphApiNavigationElement */ (null);
        before(async () => { element = await dataFixture() });

        it('renders the section title without documents', () => {
          const title = element.shadowRoot.querySelector('.documentation .section-title');
          assert.ok(title);
        });

        it('renders the empty info', () => {
          const p = element.shadowRoot.querySelector('.documentation .empty-section');
          assert.ok(p, 'has the info');
          assert.equal(p.textContent.trim(), 'No documentations in this API');
        });
      });

      describe('Adding a documentation', () => {
        let element = /** @type GraphApiNavigationElement */ (null);
        beforeEach(async () => { 
          await store.createWebApi({});
          element = await dataFixture() 
        });

        it('opens the documentations when no opened', async () => {
          await element.addDocumentation();
          assert.isTrue(element.documentationsOpened);
        });

        it('sets the [addingDocumentationValue]', async () => {
          await element.addDocumentation();
          assert.isTrue(element[addingDocumentationValue]);
        });

        it('sets the default [addingExternalValue]', async () => {
          await element.addDocumentation();
          assert.isFalse(element[addingExternalValue]);
        });

        it('sets the set [addingExternalValue]', async () => {
          await element.addDocumentation(true);
          assert.isTrue(element[addingExternalValue]);
        });

        it('renders the simple input element inside the documentation', async () => {
          await element.addDocumentation();
          const input = element.shadowRoot.querySelector('.add-documentation-input input');
          assert.ok(input);
        });

        it('focuses on the name input for inline docs', async () => {
          await element.addDocumentation();
          const input = element.shadowRoot.querySelector('.add-documentation-input input');
          assert.isTrue(element.shadowRoot.activeElement === input, 'has focus in the shadow DOM');
        });

        it('renders the URL input element for external documentation', async () => {
          await element.addDocumentation(true);
          const input = element.shadowRoot.querySelector('.add-external-doc-input input');
          assert.ok(input);
        });

        it('focuses on the URL input for external docs', async () => {
          await element.addDocumentation(true);
          const input = element.shadowRoot.querySelector('.add-external-doc-input input');
          assert.isTrue(element.shadowRoot.activeElement === input, 'has focus in the shadow DOM');
        });

        it('removes the input when Escape (inline docs)', async () => {
          await element.addDocumentation();
          const input = /** @type HTMLInputElement */ (element.shadowRoot.querySelector('.add-documentation-input input'));
          input.value = 'test';
          input.dispatchEvent(new KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            composed: true,
            key: 'Escape',
            code: 'Escape',
          }));
          await nextFrame();
          const node = /** @type HTMLInputElement */ (element.shadowRoot.querySelector('.add-documentation-input input'));
          assert.notOk(node, 'input is not in the DOM')
        });

        it('removes the input when Escape (external docs)', async () => {
          await element.addDocumentation(true);
          const input = /** @type HTMLInputElement */ (element.shadowRoot.querySelector('.add-documentation-input input'));
          input.value = 'test';
          input.dispatchEvent(new KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            composed: true,
            key: 'Escape',
            code: 'Escape',
          }));
          await nextFrame();
          const node = /** @type HTMLInputElement */ (element.shadowRoot.querySelector('.add-documentation-input input'));
          assert.notOk(node, 'input is not in the DOM')
        });

        it('adds new inline documentation on enter', async () => {
          await element.addDocumentation();
          const input = /** @type HTMLInputElement */ (element.shadowRoot.querySelector('.add-documentation-input input'));
          input.value = 'A documentation';
          input.dispatchEvent(new KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            composed: true,
            key: 'Enter',
            code: 'Enter',
          }));
          const e = await oneEvent(window, StoreEventTypes.Documentation.State.created);
          assert.equal(e.detail.item.title, 'A documentation', 'created the documentation');
        });

        it('renders added inline documentation on enter', async () => {
          await element.addDocumentation();
          const input = /** @type HTMLInputElement */ (element.shadowRoot.querySelector('.add-documentation-input input'));
          input.value = 'A documentation';
          input.dispatchEvent(new KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            composed: true,
            key: 'Enter',
            code: 'Enter',
          }));
          await oneEvent(window, StoreEventTypes.Documentation.State.created);
          await nextFrame();
          const node = element.shadowRoot.querySelector('.list-item.documentation');
          assert.ok(node, 'has the item');
          assert.equal(node.textContent.trim(), 'A documentation', 'renders the name');
        });

        it('adds new external documentation on enter', async () => {
          await element.addDocumentation(true);
          const url = 'https://api.com';
          const title = 'External doc';
          /** @type HTMLInputElement */ (element.shadowRoot.querySelector('.add-external-doc-input input')).value = url;
          const input = /** @type HTMLInputElement */ (element.shadowRoot.querySelector('.add-documentation-input input'));
          input.value = title;
          input.dispatchEvent(new KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            composed: true,
            key: 'Enter',
            code: 'Enter',
          }));
          const e = await oneEvent(window, StoreEventTypes.Documentation.State.created);
          assert.equal(e.detail.item.title, title, 'has the title');
          assert.equal(e.detail.item.url, url, 'has the url');
        });
        
        it('renders new external documentation on enter', async () => {
          await element.addDocumentation(true);
          const url = 'https://api.com';
          const title = 'External doc';
          /** @type HTMLInputElement */ (element.shadowRoot.querySelector('.add-external-doc-input input')).value = url;
          const input = /** @type HTMLInputElement */ (element.shadowRoot.querySelector('.add-documentation-input input'));
          input.value = title;
          input.dispatchEvent(new KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            composed: true,
            key: 'Enter',
            code: 'Enter',
          }));
          await oneEvent(window, StoreEventTypes.Documentation.State.created);
          await nextFrame();
          const node = element.shadowRoot.querySelector('.list-item.documentation');
          assert.equal(node.textContent.trim(), title, 'renders the name');
        });
      });

      describe('Editing documentation name', () => {
        let element = /** @type GraphApiNavigationElement */ (null);
        const title1 = 'Doc 1';
        const desc1 = 'A description';
        const title2 = 'Doc 2';
        const url2 = 'https://domain.com';
        let id1;
        let id2;

        beforeEach(async () => {
          await store.createWebApi({});
          id1 = (await store.addDocumentation({ title: title1, description: desc1 })).id;
          id2 = (await store.addDocumentation({ title: '', description: title2, url: url2 })).id;
          element = await dataFixture();
        });

        it('renders the input instead of a inline doc list item', async () => {
          await element.renameAction(id1);
          const input = /** @type HTMLInputElement */ (element.shadowRoot.querySelector(`input[data-id="${id1}"]`));
          assert.ok(input, 'has the input');
        });

        it('renders the input instead of a external doc list item', async () => {
          await element.renameAction(id2);
          const input = /** @type HTMLInputElement */ (element.shadowRoot.querySelector(`input[data-id="${id2}"]`));
          assert.ok(input, 'has the input');
        });

        it('cancels on Escape', async () => {
          await element.renameAction(id1);
          const input = /** @type HTMLInputElement */ (element.shadowRoot.querySelector(`input[data-id="${id1}"]`));
          input.value = 'test';
          input.dispatchEvent(new KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            composed: true,
            key: 'Escape',
            code: 'Escape',
          }));
          await nextFrame();
          const node = /** @type HTMLInputElement */ (element.shadowRoot.querySelector(`input[data-id="${id1}"]`));
          assert.notOk(node, 'input is not in the DOM')
        });

        it('updates the inline doc title on enter', async () => {
          await element.renameAction(id1);
          const input = /** @type HTMLInputElement */ (element.shadowRoot.querySelector(`input[data-id="${id1}"]`));
          input.value = 'updated';
          input.dispatchEvent(new KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            composed: true,
            key: 'Enter',
            code: 'Enter',
          }));
          const e = await oneEvent(window, StoreEventTypes.Documentation.State.updated);
          assert.equal(e.detail.item.title, 'updated', 'updates the title');
        });

        it('renders the new name after input closes', async () => {
          await element.renameAction(id1);
          const input = /** @type HTMLInputElement */ (element.shadowRoot.querySelector(`input[data-id="${id1}"]`));
          input.value = 'updated';
          input.dispatchEvent(new KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            composed: true,
            key: 'Enter',
            code: 'Enter',
          }));
          await oneEvent(window, StoreEventTypes.Documentation.State.updated);
          await nextFrame();
          const node = element.shadowRoot.querySelector(`.list-item[data-graph-id="${id1}"]`);
          assert.ok(node, 'has the item');
          assert.equal(node.textContent.trim(), 'updated', 'renders the title');
        });

        it('renders the new description after external input closes', async () => {
          await element.renameAction(id2);
          const input = /** @type HTMLInputElement */ (element.shadowRoot.querySelector(`input[data-id="${id2}"]`));
          input.value = 'updated';
          input.dispatchEvent(new KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            composed: true,
            key: 'Enter',
            code: 'Enter',
          }));
          const e = await oneEvent(window, StoreEventTypes.Documentation.State.updated);
          assert.equal(e.detail.item.description, 'updated', 'updates the description');
          await nextFrame();
          const node = element.shadowRoot.querySelector(`.list-item[data-graph-id="${id2}"]`);
          assert.ok(node, 'has the item');
          assert.equal(node.textContent.trim(), 'updated', 'renders the title');
        });
      });

      describe('Deleting a documentation', () => {
        let element = /** @type GraphApiNavigationElement */ (null);
        const title1 = 'Doc 1';
        const desc1 = 'A description';
        const title2 = 'Doc 2';
        const url2 = 'https://domain.com';
        let id1;
        let id2;

        beforeEach(async () => {
          await store.createWebApi({});
          id1 = (await store.addDocumentation({ title: title1, description: desc1 })).id;
          id2 = (await store.addDocumentation({ title: '', description: title2, url: url2 })).id;
          element = await dataFixture();
        });

        it('removes the inline doc list item', async () => {
          await StoreEvents.Documentation.delete(window, id1);
          await nextFrame();
          const node = element.shadowRoot.querySelector(`.list-item[data-graph-id="${id1}"]`);
          assert.notOk(node);
        });

        it('removes the external doc list item', async () => {
          await StoreEvents.Documentation.delete(window, id2);
          await nextFrame();
          const node = element.shadowRoot.querySelector(`.list-item[data-graph-id="${id2}"]`);
          assert.notOk(node);
        });
      });
    });

    describe('Schema editing', () => {
      describe('Data rendering', () => {
        let element = /** @type GraphApiNavigationElement */ (null);
        before(async () => { element = await dataFixture() });

        it('renders the section title without documents', () => {
          const title = element.shadowRoot.querySelector('.schemas .section-title');
          assert.ok(title);
        });

        it('renders the empty info', () => {
          const p = element.shadowRoot.querySelector('.schemas .empty-section');
          assert.ok(p, 'has the info');
          assert.equal(p.textContent.trim(), 'No schemas in this API');
        });
      });

      describe('Adding a schema', () => {
        let element = /** @type GraphApiNavigationElement */ (null);
        beforeEach(async () => { 
          await store.createWebApi({});
          element = await dataFixture() 
        });

        it('opens the schemas when no opened', async () => {
          await element.addSchema();
          assert.isTrue(element.schemasOpened);
        });

        it('sets the [addingSchemaValue]', async () => {
          await element.addSchema();
          assert.isTrue(element[addingSchemaValue]);
        });

        it('sets the default [addingSchemaTypeValue]', async () => {
          await element.addSchema();
          assert.equal(element[addingSchemaTypeValue], 'object');
        });

        it('sets the passed [addingSchemaTypeValue]', async () => {
          await element.addSchema('scalar');
          assert.equal(element[addingSchemaTypeValue], 'scalar');
        });

        it('renders the input element inside the schemas', async () => {
          await element.addSchema();
          const input = element.shadowRoot.querySelector('.add-schema-input input');
          assert.ok(input);
        });

        it('focuses on the name input for inline docs', async () => {
          await element.addSchema();
          const input = element.shadowRoot.querySelector('.add-schema-input input');
          assert.isTrue(element.shadowRoot.activeElement === input, 'has focus in the shadow DOM');
        });

        it('removes the input when Escape (inline docs)', async () => {
          await element.addSchema();
          const input = /** @type HTMLInputElement */ (element.shadowRoot.querySelector('.add-schema-input input'));
          input.value = 'test';
          input.dispatchEvent(new KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            composed: true,
            key: 'Escape',
            code: 'Escape',
          }));
          await nextFrame();
          const node = /** @type HTMLInputElement */ (element.shadowRoot.querySelector('.add-schema-input input'));
          assert.notOk(node, 'input is not in the DOM')
        });

        function dispatchEnter(input) {
          input.dispatchEvent(new KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            composed: true,
            key: 'Enter',
            code: 'Enter',
          }));
        }

        it('adds new (default) schema on enter', async () => {
          await element.addSchema();
          const input = /** @type HTMLInputElement */ (element.shadowRoot.querySelector('.add-schema-input input'));
          input.value = 'A schema';
          dispatchEnter(input);
          const e = await oneEvent(window, StoreEventTypes.Type.State.created);
          assert.equal(e.detail.item.name, 'A schema', 'created the documentation');
          assert.equal(e.detail.item.types[0], ns.w3.shacl.NodeShape, 'has the object type');
        });

        it('adds new (object) schema on enter', async () => {
          await element.addSchema('object');
          const input = /** @type HTMLInputElement */ (element.shadowRoot.querySelector('.add-schema-input input'));
          input.value = 'A schema';
          dispatchEnter(input);
          const e = await oneEvent(window, StoreEventTypes.Type.State.created);
          assert.equal(e.detail.item.types[0], ns.w3.shacl.NodeShape, 'has the object type');
        });

        it('adds new (scalar) schema on enter', async () => {
          await element.addSchema('scalar');
          const input = /** @type HTMLInputElement */ (element.shadowRoot.querySelector('.add-schema-input input'));
          input.value = 'A schema';
          dispatchEnter(input);
          const e = await oneEvent(window, StoreEventTypes.Type.State.created);
          assert.equal(e.detail.item.types[0], ns.aml.vocabularies.shapes.ScalarShape, 'has the scalar type');
        });

        it('adds new (array) schema on enter', async () => {
          await element.addSchema('array');
          const input = /** @type HTMLInputElement */ (element.shadowRoot.querySelector('.add-schema-input input'));
          input.value = 'A schema';
          dispatchEnter(input);
          const e = await oneEvent(window, StoreEventTypes.Type.State.created);
          assert.equal(e.detail.item.types[0], ns.aml.vocabularies.shapes.ArrayShape, 'has the scalar type');
        });

        it('adds new (file) schema on enter', async () => {
          await element.addSchema('file');
          const input = /** @type HTMLInputElement */ (element.shadowRoot.querySelector('.add-schema-input input'));
          input.value = 'A schema';
          dispatchEnter(input);
          const e = await oneEvent(window, StoreEventTypes.Type.State.created);
          assert.equal(e.detail.item.types[0], ns.aml.vocabularies.shapes.FileShape, 'has the scalar type');
        });

        it('adds new (union) schema on enter', async () => {
          await element.addSchema('union');
          const input = /** @type HTMLInputElement */ (element.shadowRoot.querySelector('.add-schema-input input'));
          input.value = 'A schema';
          dispatchEnter(input);
          const e = await oneEvent(window, StoreEventTypes.Type.State.created);
          assert.equal(e.detail.item.types[0], ns.aml.vocabularies.shapes.UnionShape, 'has the scalar type');
        });

        it('renders added schema on enter', async () => {
          await element.addSchema();
          const input = /** @type HTMLInputElement */ (element.shadowRoot.querySelector('.add-schema-input input'));
          input.value = 'A schema';
          dispatchEnter(input);
          await oneEvent(window, StoreEventTypes.Type.State.created);
          await nextFrame();
          const node = element.shadowRoot.querySelector('.list-item.schema');
          assert.ok(node, 'has the item');
          assert.equal(node.textContent.trim(), 'A schema', 'renders the name');
        });
      });

      describe('Editing schema name', () => {
        let element = /** @type GraphApiNavigationElement */ (null);
        const name = 'A schema';
        let id;

        beforeEach(async () => {
          await store.createWebApi({});
          id = (await store.addType({ name, type: ns.aml.vocabularies.shapes.ScalarShape })).id;
          element = await dataFixture();
        });

        it('renders the input instead of the list item', async () => {
          await element.renameAction(id);
          const input = /** @type HTMLInputElement */ (element.shadowRoot.querySelector(`input[data-id="${id}"]`));
          assert.ok(input, 'has the input');
        });

        it('cancels on Escape', async () => {
          await element.renameAction(id);
          const input = /** @type HTMLInputElement */ (element.shadowRoot.querySelector(`input[data-id="${id}"]`));
          input.value = 'test';
          input.dispatchEvent(new KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            composed: true,
            key: 'Escape',
            code: 'Escape',
          }));
          await nextFrame();
          const node = /** @type HTMLInputElement */ (element.shadowRoot.querySelector(`input[data-id="${id}"]`));
          assert.notOk(node, 'input is not in the DOM')
        });

        it('updates the name on enter', async () => {
          await element.renameAction(id);
          const input = /** @type HTMLInputElement */ (element.shadowRoot.querySelector(`input[data-id="${id}"]`));
          input.value = 'updated';
          input.dispatchEvent(new KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            composed: true,
            key: 'Enter',
            code: 'Enter',
          }));
          const e = await oneEvent(window, StoreEventTypes.Type.State.updated);
          assert.equal(e.detail.item.name, 'updated', 'updates the name');
        });

        it('updates the name on input blur', async () => {
          await element.renameAction(id);
          const input = /** @type HTMLInputElement */ (element.shadowRoot.querySelector(`input[data-id="${id}"]`));
          input.value = 'updated';
          input.dispatchEvent(new Event('blur'));
          const e = await oneEvent(window, StoreEventTypes.Type.State.updated);
          assert.equal(e.detail.item.name, 'updated', 'updates the name');
        });

        it('renders the new name after input closes', async () => {
          await element.renameAction(id);
          const input = /** @type HTMLInputElement */ (element.shadowRoot.querySelector(`input[data-id="${id}"]`));
          input.value = 'updated';
          input.dispatchEvent(new KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            composed: true,
            key: 'Enter',
            code: 'Enter',
          }));
          await oneEvent(window, StoreEventTypes.Type.State.updated);
          await nextFrame();
          const node = element.shadowRoot.querySelector(`.list-item[data-graph-id="${id}"]`);
          assert.ok(node, 'has the item');
          assert.equal(node.textContent.trim(), 'updated', 'renders the name');
        });

        it('updates the display name when present', async () => {
          await store.updateTypeProperty(id, 'displayName', 'a dn');
          await element.renameAction(id);
          const input = /** @type HTMLInputElement */ (element.shadowRoot.querySelector(`input[data-id="${id}"]`));
          input.value = 'updated';
          input.dispatchEvent(new KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            composed: true,
            key: 'Enter',
            code: 'Enter',
          }));
          const e = await oneEvent(window, StoreEventTypes.Type.State.updated);
          assert.equal(e.detail.item.displayName, 'updated', 'updates the displayName');
        });
      });

      describe('Deleting a schema', () => {
        let element = /** @type GraphApiNavigationElement */ (null);
        const name = 'A schema';
        let id;

        beforeEach(async () => {
          await store.createWebApi({});
          id = (await store.addType({ name, type: ns.aml.vocabularies.shapes.ScalarShape })).id;
          element = await dataFixture();
        });

        it('removes list item from the view', async () => {
          await StoreEvents.Type.delete(window, id);
          await nextFrame();
          const node = /** @type HTMLElement */ (element.shadowRoot.querySelector(`.schemas .list-item`));
          assert.notOk(node, 'item is removed');
        });
      });
    });
  });
});
