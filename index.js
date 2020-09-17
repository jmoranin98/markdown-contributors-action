const core = require('@actions/core');
const gh = require('@actions/github');
const axios = require('axios');

const fs = require('fs');

(async () => {
  try {
    const doc = fs.readFileSync(core.getInput('path'));
    const outputPath = core.getInput('output_path');

    const { contributors } = JSON.parse(doc);

    let contributorsStr = '';

    if (
      contributors &&
      Array.isArray(contributors)
    ) {
      for (let contributor of contributors) {
        let imageUrl = '';
        let contributorName = '';

        if (typeof contributor === 'object') {
          if (contributor.avatar_url) imageUrl = contributor.avatar_url;
          else {
            const { data } = await axios(`https://api.github.com/users/${contributor.login}`);
            const { avatar_url } = data;
            imageUrl = avatar_url;
          }

          contributorName = contributor.login;
        } else if (typeof contributor === 'string') {
          const { data } = await axios(`https://api.github.com/users/${contributor}`);
          const { avatar_url } = data;

          imageUrl = avatar_url;
          contributorName = contributor;
        } else core.setFailed('Not supported format');

        contributorsStr += `- <img src="${imageUrl}" height='50' width='50' /> ${contributorName}\n`;
      }
    }

    const markdownContent = `# Contributors\n${contributorsStr}`;

    fs.writeFileSync(outputPath, markdownContent);
  } catch (error) {
    core.setFailed(error.message);
  }
})();
