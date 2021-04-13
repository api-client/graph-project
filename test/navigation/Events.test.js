import { assert } from '@open-wc/testing';

import {
  NavigationEventTypes,
  APIGraphNavigationEvent,
  APIExternalNavigationEvent,
  APIHelpTopicEvent,
} from  '../../index.js';

describe('Navigation.Events', () => {
  describe('APIGraphNavigationEvent', () => {
    const graphId = 'amf://id';
    const graphType = 'endpoint';
    const opts = { parent: 'amf://123' };

    it('has the correct type', () => {
      const e = new APIGraphNavigationEvent(graphId, graphType);
      assert.equal(e.type, NavigationEventTypes.navigate);
    });

    it('has the readonly graphId property', () => {
      const e = new APIGraphNavigationEvent(graphId, graphType);
      assert.equal(e.graphId, graphId);
      assert.throws(() => {
        // @ts-ignore
        e.graphId = 'test';
      });
    });

    it('has the readonly graphType property', () => {
      const e = new APIGraphNavigationEvent(graphId, graphType);
      assert.equal(e.graphType, graphType);
      assert.throws(() => {
        // @ts-ignore
        e.graphType = 'test';
      });
    });

    it('has the options property', () => {
      const e = new APIGraphNavigationEvent(graphId, graphType, opts);
      assert.deepEqual(e.options, opts);
    });
  });

  describe('APIExternalNavigationEvent', () => {
    const url = 'test-url';

    it('has the correct type', () => {
      const e = new APIExternalNavigationEvent(url);
      assert.equal(e.type, NavigationEventTypes.navigateExternal);
    });

    it('has readonly url property', () => {
      const e = new APIExternalNavigationEvent(url);
      assert.equal(e.url, url);
      assert.throws(() => {
        // @ts-ignore
        e.url = 'test';
      });
    });

    it('has the detail object', () => {
      const cnf = { purpose: 'test' };
      const e = new APIExternalNavigationEvent(url, cnf);
      assert.deepEqual(e.detail, cnf);
    });

    it('has the default detail', () => {
      const e = new APIExternalNavigationEvent(url);
      assert.deepEqual(e.detail, {});
    });
  });

  describe('APIHelpTopicEvent', () => {
    const topic = 'test-topic';

    it('has the correct type', () => {
      const e = new APIHelpTopicEvent(topic);
      assert.equal(e.type, NavigationEventTypes.helpTopic);
    });

    it('has the read only topic property', () => {
      const e = new APIHelpTopicEvent(topic);
      assert.equal(e.topic, topic);
      assert.throws(() => {
        // @ts-ignore
        e.topic = 'test';
      });
    });

    it('is cancelable', () => {
      const e = new APIHelpTopicEvent(topic);
      assert.isTrue(e.cancelable);
    });

    it('bubbles', () => {
      const e = new APIHelpTopicEvent(topic);
      assert.isTrue(e.bubbles);
    });
  });
});
