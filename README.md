# fastify-plugin-example

Fastify plugin template.

## Github Actions/Workflows

#### Getting Started

* Create release and test workflows
  ```sh
  cd .github/workflows
  cp release.yml.example release.yml
  cp test.yml.example test.yml
  ```
* Update `release.yml` and `test.yml` with appropriate workflow for your plugin

#### Triggering a Release

* Trigger the release workflow via release tag
  ```sh
  git checkout main && git pull
  npm version { minor | major | path }
  git push --follow-tags
  ```
