/* eslint-disable max-classes-per-file */
import { NavigationEventTypes } from './EventTypes.js';

/** @typedef {import('./Events').ExternalNavigationOptions} ExternalNavigationOptions */
/** @typedef {import('./Events').APIGraphNavigationOptions} APIGraphNavigationOptions */


export const graphIdValue = Symbol('graphIdValue');
export const graphTypeValue = Symbol('graphTypeValue');
export const optionsValue = Symbol('optionsValue');
export const passiveValue = Symbol('passiveValue');
export const urlValue = Symbol('urlValue');
export const topicValue = Symbol('topicValue');


/**
 * A general purpose event dispatched to trigger the navigation.
 */
export class APIGraphNavigationEvent extends Event {
  /**
   * The domain id used to initialize this event.
   */
  get graphId() {
    return this[graphIdValue];
  }

  /**
   * The domain type used to initialize this event.
   */
  get graphType() {
    return this[graphTypeValue];
  }

  /**
   * Additional navigation options used to initialize this event.
   */
  get options() {
    return this[optionsValue];
  }

  /**
   * @param {string} graphId The domain id from the graph model.
   * @param {string} graphType The domain type (endpoint, operation, schema, security, documentation, etc)
   * @param {APIGraphNavigationOptions=} opts Additional navigation options.
   */
  constructor(graphId, graphType, opts) {
    super(NavigationEventTypes.navigate, {
      bubbles: true,
      composed: true,
      cancelable: true,
    });
    this[graphIdValue] = graphId;
    this[graphTypeValue] = graphType;
    this[optionsValue] = opts;
  }
}

/**
 * An event to be dispatched when an external navigation is requested.
 * The event contains the `url` property that describes the URL to navigate to
 * and the `detail` with additional navigation options.
 */
export class APIExternalNavigationEvent extends CustomEvent {
  /**
   * @returns {string} The URL to navigate to used to initialize this event.
   */
  get url() {
    return this[urlValue];
  }

  /**
   * @param {string} url The URL to open
   * @param {ExternalNavigationOptions=} detail Additional request parameters
   */
  constructor(url, detail={}) {
    super(NavigationEventTypes.navigateExternal, {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail,
    });
    this[urlValue] = url;
  }
}

/**
 * An event to be dispatched when a help topic is being requested by the user.
 */
export class APIHelpTopicEvent extends Event {
  /**
   * @returns {string} The help topic used to initialize this event.
   */
  get topic() {
    return this[topicValue];
  }

  /**
   * @param {string} topic The help topic to open.
   */
  constructor(topic) {
    super(NavigationEventTypes.helpTopic, {
      bubbles: true,
      composed: true,
      cancelable: true,
    });
    this[topicValue] = topic;
  }
}
