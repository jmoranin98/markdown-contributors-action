const core = require('@actions/core');
const gh = require('@actions/github');
const axios = require('axios');
const Liquid = require('liquid')
const engine = new Liquid.Engine();

const fs = require('fs');

(async () => {
  try {
    const doc = fs.readFileSync(core.getInput('path'));
    const templateDoc = fs.readFileSync(core.getInput('template_path'), 'utf-8');
    const outputPath = core.getInput('output_path');

    console.log(templateDoc);

    const { contributors } = JSON.parse(doc);

    const finalContributors = [];

    if (
      contributors &&
      Array.isArray(contributors)
    ) {
      for (let contributor of contributors) {
        let imageUrl = '';
        let name = '';

        if (typeof contributor === 'object') {
          if (contributor.avatar_url) imageUrl = contributor.avatar_url;
          else {
            const { data } = await axios(`https://api.github.com/users/${contributor.login}`);
            const { avatar_url } = data;
            imageUrl = avatar_url;
          }

          name = contributor.login;
        } else if (typeof contributor === 'string') {
          const { data } = await axios(`https://api.github.com/users/${contributor}`);
          const { avatar_url } = data;

          imageUrl = avatar_url;
          name = contributor;
        } else core.setFailed('Not supported format');

        finalContributors.push({
          imageUrl,
          name,
        });
      }
    }

    const liquidTemplate = await engine.parse(templateDoc);
    const markdownContent = await liquidTemplate.render({ contributors: finalContributors });

    fs.writeFileSync(outputPath, markdownContent);
  } catch (error) {
    core.setFailed(error.message);
  }
})();
