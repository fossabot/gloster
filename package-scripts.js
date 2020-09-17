const npsUtils = require('nps-utils')

module.exports = {
  scripts: {
    clean: {
      default: {
        script: npsUtils.concurrent.nps('clean.public','clean.resources'),
        description: 'Cleans the build artifacts',
      },
      public: {
        script: npsUtils.rimraf('public'),
        description: 'Cleans the public directory of hugo artifacts',
        hiddenFromHelp: true,
      },
      resources: {
        script: npsUtils.rimraf('resources'),
        description: 'Cleans the resources directory of hugo artifacts',
        hiddenFromHelp: true,
      },
    },
    build: {
      default: {
        script: npsUtils.series.nps('clean','build.build'),
        description: 'Builds the documentation site',
      },
      build: {
        script: 'hugo --enableGitInfo --forceSyncStatic --gc --minify --noChmod',
        description: 'Builds the hugo site',
        hiddenFromHelp: true,
      },
    },
    dev_build: {
      default: {
        script: npsUtils.series.nps('clean', 'dev_build.build'),
        description: 'Builds the documentation site',
      },
      build: {
        script: 'hugo --enableGitInfo --forceSyncStatic --gc --minify --i18n-warnings --renderToMemory --templateMetrics --templateMetricsHints',
        description: 'Builds the hugo site',
        hiddenFromHelp: true,
      },
    },
    serve: {
      default: {
        script: npsUtils.series.nps('build', 'serve.serve'),
        description: 'Serves the hugo site',
      },
      serve: {
        script: 'http-server -p 28080 -a 127.0.0.1 -c-1 -U --no-dotfiles -r ./public',
        description: 'Serves the hugo site',
        hiddenFromHelp: true,
      },
    },
  },
}
