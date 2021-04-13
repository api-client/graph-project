/* eslint-disable max-classes-per-file */
import { ReportingEventTypes } from './ReportingEventTypes.js';

const errorProperty = Symbol('error');
const descriptionProperty = Symbol('description');
const componentProperty = Symbol('component');

/**
 * An event to be dispatched when an error occurs in any component.
 * The purpose of this event is to log application errors.
 */
export class GraphErrorEvent extends Event {
  /**
   * @returns {Error} The Error object used to initialize this event
   */
  get error() {
    return this[errorProperty];
  }

  /**
   * @returns {string} The description used to initialize this event
   */
  get description() {
    return this[descriptionProperty];
  }

  /**
   * @returns {string|undefined} The component used to initialize this event
   */
  get component() {
    return this[componentProperty];
  }

  /**
   * @param {Error} error The error object that caused this event
   * @param {string} description The description to be reported to the logger.
   * @param {string=} component Optional component name that triggered the exception.
   */
  constructor(error, description, component) {
    super(ReportingEventTypes.error, {
      bubbles: true,
      composed: true,
      cancelable: true,
    });
    this[errorProperty] = error;
    this[descriptionProperty] = description;
    this[componentProperty] = component;
  };
}

export const ReportingEvents = {
  /**
   * Dispatches the general error event for logging purposes.
   * @param {EventTarget} target A node on which to dispatch the event
   * @param {Error} error The error object that caused this event
   * @param {string} description The description to be reported to the logger.
   * @param {string=} component Optional component name that triggered the exception.
   */
  error: (target, error, description, component) => {
    const e = new GraphErrorEvent(error, description, component);
    target.dispatchEvent(e);
  },
};
Object.freeze(ReportingEvents);
