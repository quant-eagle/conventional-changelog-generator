const fs = require("fs");
const { capitalize } = require("./utils");
const { commitTypes, workspace, templateFilePath } = require("./context");
const core = require("@actions/core");

/**
 * Parse the specific commit mapping input into commit categories.
 *
 * Eg. feat:Features,bug:Bug Fixes -> {
 *    type: "feat",
 *    name: "Features"
 * }...
 */
const createCommitCategories = (mapping) => {
  const categories = mapping.split(",");
  return categories.map((element) => {
    const category = element.split(":");
    return {
      type: category[0],
      name: category[1],
    };
  });
};

/**
 * Obtain template file to work with. If configuration doesn't provide one
 * fallback to the default one used.
 */
const obtainTemplate = (filePath) => {
  if (!filePath) {
    return fs.readFileSync("CHANGELOG.tpl.md", "utf8");
  } else {
    return fs.readFileSync(`${workspace}/${templateFilePath}`, "utf8");
  }
};

/**
 * Given a message as a string, check whether it is a multiline string.
 * If so, cut the rest of the string after first new line.
 * Else return the string in it's original form.
 */
const createSingleLineMessage = (message) => {
  if (message.indexOf("\n") == -1) {
    return message;
  } else {
    return message.substring(0, message.indexOf("\n"));
  }
};

/**
 * Based on the given version and range of commits for the given version.
 *
 * This function returns multiline stringe based on the provided changelog template.
 *
 * It includes version name, version date and section with corresponding commits.
 */
const changelogGenerator = (version, commitData) => {
  core.info("retrieveing changelog mapping");
  const categories = createCommitCategories(commitTypes);
  const template = obtainTemplate(templateFilePath);

  const dated = template.replace("{{date}}", new Date().toLocaleDateString());
  const versioned = dated.replace("{{versionName}}", version);

  core.info("creating changelog template");
  const templateCategories = new Map();
  commitData.forEach((val) => {
    const commit = createSingleLineMessage(val.commit.message);
    const category = categories.find((value) => {
      if (commit.indexOf(value.type) != -1) {
        return value;
      } else {
        return undefined;
      }
    });
    if (category) {
      const commitMessage = commit.substring(
        commit.indexOf(": ") + 2,
        commit.length
      );
      const message = capitalize(
        commitMessage[0],
        commitMessage.substring(1, commitMessage.length)
      );
      if (!templateCategories.has(category.name)) {
        templateCategories.set(category.name, [message]);
      } else {
        const currentCommits = templateCategories.get(category.name);
        currentCommits.push(message);
        templateCategories.set(category.name, currentCommits);
      }
    }
  });

  const selector = { section: "{{.SECTION}}", data: "{{.COMMITS}}" };
  const sectionFormat = versioned.substring(
    versioned.indexOf(selector.section) + selector.section.length,
    versioned.lastIndexOf(selector.section)
  );
  const sectionDataFormat = versioned.substring(
    versioned.indexOf(selector.data) + selector.data.length,
    versioned.lastIndexOf(selector.data)
  );

  const templateCategorySections = [];
  templateCategories.forEach((messages, section) => {
    templateCategorySections.push(
      `${sectionFormat.replace("$title", section)}\n`
    );
    messages.forEach((message) => {
      templateCategorySections.push(
        `${sectionDataFormat.replace("$commit", message)}\n`
      );
    });
    templateCategorySections.push(`\n`);
  });

  const final = versioned.replace(
    `${versioned.substring(
      versioned.indexOf(selector.section),
      versioned.lastIndexOf(selector.data) + selector.data.length
    )}`,
    templateCategorySections.join("").trim()
  );

  return final;
};

const generator = (versionName, commits) => {
  return changelogGenerator(versionName, commits);
};

module.exports = generator;
