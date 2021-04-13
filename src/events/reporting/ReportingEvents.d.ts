declare const errorProperty: unique symbol;
declare const descriptionProperty: unique symbol;
declare const componentProperty: unique symbol;

/**
 * An event to be dispatched when an error occurs in any component.
 * The purpose of this event is to log application errors.
 */
export class GraphErrorEvent extends Event {
  /**
   * @returns The Error object used to initialize this event
   */
  get error(): Error;

  /**
   * @returns The description used to initialize this event
   */
  get description(): string;

  /**
   * @returns The component used to initialize this event
   */
  get component(): string|undefined;

  [errorProperty]: Error;
  [descriptionProperty]: string;
  [componentProperty]?: string;
  /**
   * @param error The error object that caused this event
   * @param description The description to be reported to the logger.
   * @param component Optional component name that triggered the exception.
   */
  constructor(error: Error, description: string, component?: string);
}

declare interface IReportingEvents {
  /**
   * Dispatches the general error event for logging purposes.
   * @param target A node on which to dispatch the event
   * @param error The error object that caused this event
   * @param description The description to be reported to the logger.
   * @param component Optional component name that triggered the exception.
   */
  error(target: EventTarget, error: Error, description: string, component?: string): void;
}

export declare const ReportingEvents: Readonly<IReportingEvents>;
