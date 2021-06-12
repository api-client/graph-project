import { fixture, assert, html } from '@open-wc/testing';
import { AmfStoreService } from '@api-client/amf-store/worker.index.js';
import { nextFrame, oneEvent } from '@open-wc/testing-helpers';
import { AmfLoader } from '../helpers/AmfLoader.js';
import '../../graph-api-navigation.js';
import { NavigationEventTypes } from '../../src/events/navigation/EventTypes.js';

/** @typedef {import('@anypoint-web-components/anypoint-collapse').AnypointCollapseElement} AnypointCollapseElement */
/** @typedef {import('../..').GraphApiNavigationElement} GraphApiNavigationElement */
/** @typedef {import('../..').APIExternalNavigationEvent} APIExternalNavigationEvent */

describe('GraphApiNavigationElement', () => {
  let store = /** @type AmfStoreService */ (null);
  before(async () => {
    const api = await AmfLoader.loadApi('oas-3-api.json');
    store = new AmfStoreService(window, {
      amfLocation: '/node_modules/@api-client/amf-store/amf-bundle.js',
    });
    await store.init();
    await store.loadGraph(api);
  });

  describe('OAS 3 API model', () => {
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
          securityOpened></graph-api-navigation>
      `));
      await oneEvent(elm, 'graphload');
      await nextFrame();
      return elm;
    }

    describe('Documentation rendering', () => {
      let element = /** @type GraphApiNavigationElement */ (null);
      before(async () => { element = await dataFixture() });

      it('renders the external link', () => {
        const link = /** @type HTMLAnchorElement */ (element.shadowRoot.querySelector('a.documentation'));
        assert.ok(link, 'has the link');
        assert.equal(link.href, 'https://domain.com/', 'has the URL');
        assert.equal(link.textContent.trim(), 'ABout this API.', 'has the label');
      });

      it('dispatches the external navigation event', () => {
        let url = '';
        element.addEventListener(NavigationEventTypes.navigateExternal, 
          /**
           * @param {APIExternalNavigationEvent} e 
           */
          function f(e) {
            element.removeEventListener(NavigationEventTypes.navigateExternal, f);
            e.preventDefault();
            url = e.url;
          });
        const link = /** @type HTMLAnchorElement */ (element.shadowRoot.querySelector('a.documentation'));
        link.click();
        assert.equal(url, 'https://domain.com/');
      });
    });
  });
});
