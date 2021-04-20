import { ContextMenu } from '@api-client/context-menu';

export declare class NavigationContextMenu extends ContextMenu {
  /**
   * Finds the click target which
   */
  findTarget(e: MouseEvent): HTMLElement|SVGElement|undefined;

  /**
   * Maps an element to an internal target name.
   *
   * @param element The context click target
   * @returns The internal target name.
   */
  elementToTarget(element: HTMLElement): string|undefined;
}
