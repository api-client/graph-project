import { assert } from '@open-wc/testing';
import { NavigationEventTypes } from  '../../index.js';
import { ensureUnique } from '../helpers/EventHelper.js';

describe('NavigationEventTypes', () => {
  it('is frozen', () => {
    assert.throws(() => {
      // @ts-ignore
      NavigationEventTypes.test = { read: '' };
    });
  });

  [
    ['navigate', 'apinavigate'],
    ['navigateExternal', 'apinavigateexternal'],
    ['helpTopic', 'apinavigatehelptopic'],
  ].forEach(([prop, value]) => {
    it(`has ${prop} property`, () => {
      assert.equal(NavigationEventTypes[prop], value);
    });
  });

  describe('unique events', () => {
    it('has unique events for root properties', () => {
      ensureUnique('NavigationEventTypes', NavigationEventTypes);
    });
  });
});
