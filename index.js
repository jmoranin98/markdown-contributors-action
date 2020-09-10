const core = require('@actions/core');
const gh = require('@actions/github');

const fs = require('fs');

(async () => {
  try {
    const payload = JSON.stringify(gh.context.payload, undefined, 2);
    console.log(`Event payload: ${payload}`);

    const doc = fs.readFileSync(core.getInput('path'));
    const { contributors } = JSON.parse(doc);

    let contributorsStr = '';

    if (
      contributors &&
      Array.isArray(contributors)
    ) {
      contributors.forEach(contributor => {
        contributorsStr += `- ![alt text](https://ui-avatars.com/api/?size=56&name=${contributor.replace(' ', '+')}) ${contributor}\n`;
      });
    }

    const markdownContent = `
      # Contributors
      ${contributorsStr}
    `;

    fs.writeFileSync('contributors.md', markdownContent);
  } catch (error) {
    core.setFailed(error.message);
  }
})();
