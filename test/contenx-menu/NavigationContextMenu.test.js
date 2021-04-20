import { assert } from '@open-wc/testing';
import { NavigationContextMenu } from '../../index.js';

describe('NavigationContextMenu', () => {
  describe('findTarget()', () => {
    let workspace = /** @type HTMLElement */ (null);
    let menu = /** @type NavigationContextMenu */ (null);
    beforeEach(() => {
      workspace = document.createElement('div');
      menu = new NavigationContextMenu(workspace);
    });

    function getEvent() {
      const e = new PointerEvent('click', {
        bubbles: true,
        composed: true,
      });
      return e;
    }

    it('returns the workspace as the target', () => {
      const e = getEvent();
      let result;
      workspace.addEventListener('click', (ev) => {
        result = menu.findTarget(ev);
      });
      workspace.dispatchEvent(e);
      assert.isTrue(result === workspace, 'returns the workspace');
    });

    it('returns a .list-item as the target', () => {
      const li = document.createElement('div');
      li.classList.add('list-item')
      workspace.append(li);
      const e = getEvent();
      let result;
      workspace.addEventListener('click', (ev) => {
        result = menu.findTarget(ev);
      });
      li.dispatchEvent(e);
      assert.isTrue(result === li, 'returns the list item');
    });

    it('returns a .section-title as the target', () => {
      const st = document.createElement('div');
      st.classList.add('section-title')
      workspace.append(st);
      const e = getEvent();
      let result;
      workspace.addEventListener('click', (ev) => {
        result = menu.findTarget(ev);
      });
      st.dispatchEvent(e);
      assert.isTrue(result === st, 'returns the section target item');
    });

    it('returns a .section-title while click inside', () => {
      const st = document.createElement('div');
      st.classList.add('section-title')
      const label = document.createElement('span');
      st.append(label);
      workspace.append(st);
      const e = getEvent();
      let result;
      workspace.addEventListener('click', (ev) => {
        result = menu.findTarget(ev);
      });
      label.dispatchEvent(e);
      assert.isTrue(result === st, 'returns the section target item');
    });
  });

  describe('elementToTarget()', () => {
    let workspace = /** @type HTMLElement */ (null);
    let menu = /** @type NavigationContextMenu */ (null);
    beforeEach(() => {
      workspace = document.createElement('div');
      menu = new NavigationContextMenu(workspace);
    });

    it('returns "root" for the workspace', () => {
      const result = menu.elementToTarget(workspace);
      assert.equal(result, 'root');
    });

    it('returns data-graph-shape value', () => {
      const elm = document.createElement('div');
      elm.dataset.graphShape = 'test-shape';
      const result = menu.elementToTarget(elm);
      assert.equal(result, 'test-shape');
    });

    it('returns data-section value', () => {
      const elm = document.createElement('div');
      elm.dataset.section = 'test-section';
      const result = menu.elementToTarget(elm);
      assert.equal(result, 'test-section');
    });

    it('returns the default value', () => {
      const elm = document.createElement('div');
      elm.classList.add('elm');
      const result = menu.elementToTarget(elm);
      assert.equal(result, 'div.elm');
    });
  });
});
