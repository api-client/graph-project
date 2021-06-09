import { LitElement, CSSResult, TemplateResult } from 'lit-element';
import { AnypointDialogMixin } from '@anypoint-web-components/anypoint-dialog';

export declare const closedHandler: unique symbol;

export default class GraphAlertDialogElement extends AnypointDialogMixin(LitElement) {
  static get styles(): CSSResult[];

  /**
   * @attribute
   */
  message: string;
  /**
   * @attribute
   */
  compatibility: boolean;

  constructor();

  connectedCallback(): void;

  disconnectedCallback(): void;

  [closedHandler](): void;

  render(): TemplateResult;
}
