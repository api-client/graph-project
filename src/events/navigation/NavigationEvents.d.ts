import { ExternalNavigationOptions, APIGraphNavigationOptions } from "./Events";

declare interface NavigationEvents {
  /**
   * Dispatches an event to trigger a navigation.
   *
   * @param target A node on which to dispatch the event.
   * @param graphId The domain id from the graph model.
   * @param graphType The domain type (endpoint, operation, schema, security, documentation, etc)
   * @param opts Additional navigation options.
   */
  navigate(target: EventTarget, graphId: string, graphType: string, opts?: APIGraphNavigationOptions): void;

  /**
   * Dispatches an event to inform the application to open a browser window.
   * This is a general purpose action. It has the `detail` object with optional
   * `purpose` property which can be used to support different kind of external navigation.
   * 
   * @param target A node on which to dispatch the event.
   * @param url The URL to open
   * @param opts  Additional request parameters
   * @returns True when the event was cancelled meaning the navigation handled.
   */
  navigateExternal(target: EventTarget, url: string, opts?: ExternalNavigationOptions): boolean;

  /**
   * Dispatches the navigate help event
   *
   * @param target A node on which to dispatch the event.
   * @param topic The help topic name
   */
  helpTopic(target: EventTarget, topic: string): void;
}

export declare const NavigationEvents: Readonly<NavigationEvents>;
