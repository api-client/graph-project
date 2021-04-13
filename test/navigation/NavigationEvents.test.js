import { assert, fixture, html } from '@open-wc/testing';
import sinon from 'sinon';
import {
  NavigationEventTypes,
  NavigationEvents,
} from  '../../index.js';

describe('NavigationEvents', () => {
  /**
   * @return {Promise<HTMLDivElement>}
   */
  async function etFixture() {
    return fixture(html`<div></div>`);
  }

  describe('navigate()', () => {
    const graphId = 'amf://id';
    const graphType = 'endpoint';
    const opts = { parent: 'amf://123' };

    it('is frozen', () => {
      assert.throws(() => {
        // @ts-ignore
        NavigationEvents.navigate = 'test';
      });
    });

    it('dispatches navigation event', async () => {
      const et = await etFixture();
      const spy = sinon.spy();
      et.addEventListener(NavigationEventTypes.navigate, spy);
      NavigationEvents.navigate(et, graphId, graphType);
      assert.isTrue(spy.calledOnce);
    });

    it('has the graphId on the event', async () => {
      const et = await etFixture();
      const spy = sinon.spy();
      et.addEventListener(NavigationEventTypes.navigate, spy);
      NavigationEvents.navigate(et, graphId, graphType);
      const e = spy.args[0][0];
      assert.equal(e.graphId, graphId);
    });

    it('has the graphType on the event', async () => {
      const et = await etFixture();
      const spy = sinon.spy();
      et.addEventListener(NavigationEventTypes.navigate, spy);
      NavigationEvents.navigate(et, graphId, graphType);
      const e = spy.args[0][0];
      assert.equal(e.graphType, graphType);
    });

    it('has the options on the detail', async () => {
      const et = await etFixture();
      const spy = sinon.spy();
      et.addEventListener(NavigationEventTypes.navigate, spy);
      NavigationEvents.navigate(et, graphId, graphType, opts);
      const e = spy.args[0][0];
      assert.deepEqual(e.options, opts);
    });
  });

  describe('navigateExternal()', () => {
    const url = 'test-url';

    it('is frozen', () => {
      assert.throws(() => {
        // @ts-ignore
        NavigationEvents.navigateExternal = 'test';
      });
    });

    it('dispatches the navigation event', async () => {
      const et = await etFixture();
      const spy = sinon.spy();
      et.addEventListener(NavigationEventTypes.navigateExternal, spy);
      NavigationEvents.navigateExternal(et, url);
      assert.isTrue(spy.calledOnce);
    });

    it('has the url property on the event', async () => {
      const et = await etFixture();
      const spy = sinon.spy();
      et.addEventListener(NavigationEventTypes.navigateExternal, spy);
      NavigationEvents.navigateExternal(et, url);
      const e = spy.args[0][0];
      assert.equal(e.url, url);
    });

    it('has the default detail object', async () => {
      const et = await etFixture();
      const spy = sinon.spy();
      et.addEventListener(NavigationEventTypes.navigateExternal, spy);
      NavigationEvents.navigateExternal(et, url);
      const e = spy.args[0][0];
      assert.deepEqual(e.detail, {});
    });

    it('has the passed detail object', async () => {
      const et = await etFixture();
      const spy = sinon.spy();
      et.addEventListener(NavigationEventTypes.navigateExternal, spy);
      const cnf = { purpose: 'test' };
      NavigationEvents.navigateExternal(et, url, cnf);
      const e = spy.args[0][0];
      assert.deepEqual(e.detail, cnf);
    });
  });

  describe('helpTopic()', () => {
    const topic = 'test-topic';

    it('is frozen', () => {
      assert.throws(() => {
        // @ts-ignore
        NavigationEvents.helpTopic = 'test';
      });
    });

    it('dispatches the help navigation event', async () => {
      const et = await etFixture();
      const spy = sinon.spy();
      et.addEventListener(NavigationEventTypes.helpTopic, spy);
      NavigationEvents.helpTopic(et, topic);
      assert.isTrue(spy.calledOnce);
    });

    it('has the topic property on the event', async () => {
      const et = await etFixture();
      const spy = sinon.spy();
      et.addEventListener(NavigationEventTypes.helpTopic, spy);
      NavigationEvents.helpTopic(et, topic);
      const e = spy.args[0][0];
      assert.equal(e.topic, topic);
    });
  });
});
