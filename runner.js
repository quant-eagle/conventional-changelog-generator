const core = require("@actions/core");

/**
 * Perform the given action and if no error occurs, return the promise.
 * @param action the action to run
 * @returns {Promise<void>}
 */
const run = async (action) => {
  try {
    await action();
  } catch (err) {
    core.setFailed(err.message);
  }
};

module.exports = run;
