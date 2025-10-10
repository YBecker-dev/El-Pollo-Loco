/**
 * Array to store active interval IDs for management.
 */
let intervalIds = [];

/**
 * Sets a stoppable interval and tracks its ID.
 * @param {Function} fn - The function to execute repeatedly.
 * @param {number} time - The time in milliseconds between executions.
 * @returns {number} The interval ID.
 */
function setStoppableInterval(fn, time) {
  const id = setInterval(fn, time);
  intervalIds.push(id);
  return id;
}

/**
 * Stops all active intervals and clears the interval IDs array.
 */
function stopGame() {
  intervalIds.forEach(clearStoppableInterval);
  intervalIds = [];
}

/**
 * Clears a specific stoppable interval and removes it from the tracked IDs.
 * @param {number} id - The interval ID to clear.
 */
function clearStoppableInterval(id) {
  clearInterval(id);
  intervalIds = intervalIds.filter((intervalId) => intervalId !== id);
}

/**
 * Gets the count of currently active intervals.
 * @returns {number} The number of active intervals.
 */
function getActiveIntervalsCount() {
  return intervalIds.length;
}
