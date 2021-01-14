const core = require("@actions/core");
const github = require("@actions/github");
const payload = github.context.payload;

if (!payload.repository || !payload.repository.name) {
  throw new Error("payload.repository.name is not defined");
}
if (
  (!payload.organization || !payload.organization.login) &&
  (!payload.repository.owner || !payload.repository.owner.login)
) {
  throw new Error(
    "payload.organization.login or payload.repository.owner.login is not defined"
  );
}

// action payload data
const owner = payload.organization
  ? payload.organization.login
  : payload.repository.owner.login;
const repo = payload.repository.name;
const workspace = process.env.GITHUB_WORKSPACE;

// action input data
const token = core.getInput("repo-token", { required: true });
const commitTypes = core.getInput("commit-types", { required: true });
const templateFilePath = core.getInput("template-path", { required: false });
const tagRegex = core.getInput("tag-regex", { required: false });

if (!token) {
  throw Error('"token" input is missing!');
}
if (!commitTypes) {
  throw Error('"commit-types" input is missing!');
}

module.exports = {
  owner,
  repo,
  token,
  commitTypes,
  workspace,
  templateFilePath,
  tagRegex,
};
