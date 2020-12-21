const github = require("@actions/github");
const { token } = require("./context.js");

module.exports = github.getOctokit(token);
