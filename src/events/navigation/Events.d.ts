export const graphIdValue: unique symbol;
export const graphTypeValue: unique symbol;
export const parentValue: unique symbol;
export const passiveValue: unique symbol;
export const urlValue: unique symbol;
export const topicValue: unique symbol;

export interface APIGraphNavigationOptions {
  /**
   * When set the navigation was not triggered by the user but by the application logic.
   * Cases the navigation to highlight the selection as a secondary selection.
   */
  passive?: boolean;
  /**
   * A parent for this object. It is reserved for API operations navigation events
   * and holds information about parent endpoint.
   */
  parent?: string;
}

/**
 * A general purpose event dispatched to trigger the navigation.
 */
export declare class APIGraphNavigationEvent extends Event {
  /**
   * The domain id used to initialize this event.
   */
  get graphId(): string;
  /**
   * The domain type used to initialize this event.
   */
  get graphType(): string;
  /**
   * Additional navigation options used to initialize this event.
   */
  get options(): APIGraphNavigationOptions|undefined;
  /**
   * @param graphId The domain id from the graph model.
   * @param graphType The domain type (endpoint, operation, schema, security, documentation, etc)
   * @param opts Additional navigation options.
   */
  constructor(graphId: string, graphType: string, opts?: APIGraphNavigationOptions);
}

export declare interface ExternalNavigationOptions {
  /**
   * The purpose of the navigation. This can be used
   * to differentiate different kind of requests.
   */
  purpose?: string;
}

/**
 * An event to be dispatched when an external navigation is requested.
 * The event contains the `url` property that describes the URL to navigate to
 * and the `detail` with additional navigation options.
 */
export declare class APIExternalNavigationEvent extends CustomEvent<ExternalNavigationOptions> {
  /**
   * The URL to navigate to used to initialize this event.
   */
  get url(): string;
  /**
   * @param url The URL to open
   * @param detail Additional request parameters
   */
  constructor(url: string, detail?: ExternalNavigationOptions);
}

/**
 * An event to be dispatched when a help topic is being requested by the user.
 */
export declare class APIHelpTopicEvent extends Event {
  /**
   * The help topic used to initialize this event.
   */
  get topic(): string;

  [topicValue]: string;

  /**
   * @param topic The help topic to open.
   */
  constructor(topic: string);
}
