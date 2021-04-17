import * as Events from './Events.js';

/** @typedef {import('./Events').ExternalNavigationOptions} ExternalNavigationOptions */
/** @typedef {import('./Events').APIGraphNavigationOptions} APIGraphNavigationOptions */

export const NavigationEvents = {
  /**
   * Dispatches an event to trigger a navigation in the API project.
   *  
   * @param {EventTarget} target A node on which to dispatch the event.
   * @param {string} graphId The domain id from the graph model.
   * @param {string} graphType The domain type (endpoint, operation, schema, security, documentation, etc)
   * @param {APIGraphNavigationOptions=} opts Additional navigation options.
   */
  navigate: (target, graphId, graphType, opts) => {
    const e = new Events.APIGraphNavigationEvent(graphId, graphType, opts);
    target.dispatchEvent(e);
  },
  /**
   * Dispatches an event to inform the application to open a browser window.
   * This is a general purpose action. It has the `detail` object with optional
   * `purpose` property which can be used to support different kind of external navigation.
   * 
   * @param {EventTarget} target A node on which to dispatch the event.
   * @param {string} url The URL to open
   * @param {ExternalNavigationOptions=} opts  Additional request parameters
   * @returns {boolean} True when the event was cancelled meaning the navigation handled.
   */
  navigateExternal: (target, url, opts) => {
    const e = new Events.APIExternalNavigationEvent(url, opts);
    target.dispatchEvent(e);
    return e.defaultPrevented;
  },
  /**
   * Dispatches the navigate help event
   *
   * @param {EventTarget} target A node on which to dispatch the event.
   * @param {string} topic The help topic name
   */
  helpTopic: (target, topic) => {
    const e = new Events.APIHelpTopicEvent(topic);
    target.dispatchEvent(e);
  },
};

Object.freeze(NavigationEvents);
