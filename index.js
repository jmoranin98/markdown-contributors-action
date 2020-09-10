const core = require('@actions/core');
const gh = require('@actions/github');

const fs = require('fs');

(async () => {
  try {
    const payload = JSON.stringify(gh.context.payload, undefined, 2);
    console.log(`Event payload: ${payload}`);

    const doc = await fs.readFile(core.getInput('path'));
    const { contributors } = JSON.parse(doc);

    let contributorsStr = '';

    if (
      contributors &&
      Array.isArray(contributors)
    ) {
      contributors.forEach(contributor => {
        contributorsStr += `${contributor} ![alt text](https://ui-avatars.com/api/?name=${contributor})\n`;
      });
    }

    const markdownContent = `
      # Contributors
      ${contributorsStr}
    `;

    await fs.writeFile('contributors.md', markdownContent);
  } catch (error) {
    core.setFailed(error.message);
  }
})();
