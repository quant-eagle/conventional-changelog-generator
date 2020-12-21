const core = require("@actions/core");
const runner = require("./runner");
const commitHistory = require("./src/history-parser");
const changelogGenerator = require("./src/generator");

const action = async () => {
  try {
    const { commits, versionName } = await commitHistory();
    const changelog = changelogGenerator(versionName, commits);
    core.setOutput("changelog", changelog);
  } catch (error) {
    core.setFailed(error);
  }
};

if (require.main === module) {
  runner(action);
}

module.exports = action;
