const core = require("@actions/core");
const octokit = require("./octokit");
const { repo, owner } = require("./context");

const rangedCommits = async (shaStart, shaEnd) => {
  core.info("fetch commit range...");
  const commitsData = await octokit.repos.compareCommits({
    owner,
    repo,
    base: shaStart,
    head: shaEnd,
  });
  core.info(
    `requested commits between "${shaStart}" and "${shaEnd}" fetched. (${commitsData.data.commits.length})`
  );
  return commitsData.data.commits;
};

module.exports = rangedCommits;
