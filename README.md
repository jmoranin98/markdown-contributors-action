# Markdown Contributors Action

This github action helps to generate markdown file of contributors which obtain the data of the contributors from a file configured as a parameter in the action, for example contributors.json or .all-contributorssrc, and it will generate a markdown file of contributors with a basic template.


### Usage

```yaml
on: [push]

jobs:
  hello_world_job:
    runs-on: ubuntu-latest
    name: A job to add contributors markdown
    steps:
      - name: Checkout
        uses: actions/checkout@v2
      - name: Generate markdown file
        uses: ./
      - uses: stefanzweifel/git-auto-commit-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          commit_message: Update generated contributors markdown
          branch: master
```
