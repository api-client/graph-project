import { ContextMenu } from '@api-client/context-menu';

export class NavigationContextMenu extends ContextMenu {
  /**
   * Finds the click target which can be one of the model objects
   * or SVG elements.
   *
   * @param {MouseEvent} e
   * @return {HTMLElement|SVGElement|undefined}
   */
  findTarget(e) {
    let target;
    const path = e.composedPath();
    while(path.length > 0) {
      const candidate = /** @type Element */ (path.shift());
      if (candidate === this.workspace || (candidate.nodeType === Node.ELEMENT_NODE && (candidate.classList.contains('list-item') || candidate.classList.contains('section-title')))) {
        target = /** @type HTMLElement */ (candidate);
        break;
      }
    }
    return target;
  }

  /**
   * Maps an element to an internal target name.
   *
   * @param {HTMLElement} element The context click target
   * @return {string|undefined} The internal target name.
   */
  elementToTarget(element) {
    if (element === this.workspace) {
      return 'root';
    }
    if (element.dataset.graphShape) {
      return element.dataset.graphShape;
    }
    if (element.dataset.section) {
      return element.dataset.section;
    }
    return super.elementToTarget(element);
  }
}
