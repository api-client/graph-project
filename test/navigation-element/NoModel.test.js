import { fixture, assert, html } from '@open-wc/testing';
import '../../graph-api-navigation.js';
import { 
  computeEndpointPaddingLeft,
  computeOperationPaddingLeft,
  computeOperationPaddingValue,
} from '../../src/GraphApiNavigationElement.js';

/** @typedef {import('../..').GraphApiNavigationElement} GraphApiNavigationElement */

describe('GraphApiNavigationElement', () => {
  describe('Basic tests (no model)', () => {
    /**
     * @returns {Promise<GraphApiNavigationElement>}
     */
    async function basicFixture() {
      return fixture(html`<graph-api-navigation></graph-api-navigation>`);
    }

    /**
     * @returns {Promise<GraphApiNavigationElement>}
     */
    async function summaryFixture() {
      return fixture(html`<graph-api-navigation summary></graph-api-navigation>`);
    }

    describe('No data rendering', () => {
      let element = /** @type GraphApiNavigationElement */ (null);
      before(async () => { element = await basicFixture() });

      it('summary is not rendered', () => {
        const panel = element.shadowRoot.querySelector('.summary');
        assert.notOk(panel);
      });
  
      it('documentation is not rendered', () => {
        const panel = element.shadowRoot.querySelector('.documentation');
        assert.notOk(panel);
      });
  
      it('types is not rendered', () => {
        const panel = element.shadowRoot.querySelector('.schemes');
        assert.notOk(panel);
      });
  
      it('security is not rendered', () => {
        const panel = element.shadowRoot.querySelector('.security');
        assert.notOk(panel);
      });
  
      it('endpoints is not rendered', () => {
        const panel = element.shadowRoot.querySelector('.endpoints');
        assert.notOk(panel);
      });
    });

    describe('Summary', () => {
      let element = /** @type GraphApiNavigationElement */ (null);
      before(async () => { element = await summaryFixture() });
  
      it('renders summary item', () => {
        const panel = element.shadowRoot.querySelector('.summary');
        assert.ok(panel);
      });
  
      it('changes selection when activating summary', () => {
        const node = /** @type HTMLElement */ (element.shadowRoot.querySelector('.list-item.summary'));
        node.click();
        assert.equal(element.selected, 'summary');
        assert.equal(element.selectedType, 'summary');
      });
    });

    describe('[computeEndpointPaddingLeft]()', () => {
      let element = /** @type GraphApiNavigationElement */ (null);
      beforeEach(async () => { element = await basicFixture() });
  
      it('returns the default padding', () => {
        const result = element[computeEndpointPaddingLeft]();
        assert.equal(result, 16);
      });
  
      it('returns value for a single value padding', () => {
        element.style.setProperty('--api-navigation-list-item-padding', '5px');
        const result = element[computeEndpointPaddingLeft]();
        assert.equal(result, 5);
      });
  
      it('returns value for a double padding value', () => {
        element.style.setProperty(
          '--api-navigation-list-item-padding',
          '5px 10px'
        );
        const result = element[computeEndpointPaddingLeft]();
        assert.equal(result, 10);
      });
  
      it('returns value for a triple padding value', () => {
        element.style.setProperty(
          '--api-navigation-list-item-padding',
          '5px 10px 15px'
        );
        const result = element[computeEndpointPaddingLeft]();
        assert.equal(result, 10);
      });
  
      it('returns value for a full padding value', () => {
        element.style.setProperty(
          '--api-navigation-list-item-padding',
          '5px 10px 15px 20px'
        );
        const result = element[computeEndpointPaddingLeft]();
        assert.equal(result, 20);
      });
    });

    describe('[computeOperationPaddingValue]()', () => {
      let element = /** @type GraphApiNavigationElement */ (null);
      beforeEach(async () => { element = await basicFixture() });
  
      it('returns value when "indent" not set', () => {
        element.indentSize = 0;
        const result = element[computeOperationPaddingValue](0);
        assert.equal(result, '56px');
      });

      it('returns value when "indentSize" not set', () => {
        element.indentSize = 0;
        const result = element[computeOperationPaddingValue](1);
        assert.equal(result, '56px');
      });

      it('returns value when indent size is set', () => {
        element.indentSize = 12;
        const result = element[computeOperationPaddingValue](2);
        assert.equal(result, '80px');
      });
    });

    describe('[computeOperationPaddingLeft]()', () => {
      let element = /** @type GraphApiNavigationElement */ (null);
      beforeEach(async () => { element = await basicFixture() });
  
      it('Computes default padding', () => {
        const result = element[computeOperationPaddingLeft]();
        assert.equal(result, 24);
      });
  
      it('Computes padding from css property', () => {
        element.style.setProperty(
          '--api-navigation-operation-item-padding-left',
          '5px'
        );
        const result = element[computeOperationPaddingLeft]();
        assert.equal(result, 5);
      });
    });

  });
});
