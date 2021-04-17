/**
 * Stops an event and cancels it.
 * @param {Event} e The event to stop
 */
export function cancelEvent(e) {
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
}
