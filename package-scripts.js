const npsUtils = require('nps-utils')

module.exports = {
  scripts: {
    favicon: {
      script: 'real-favicon generate faviconDescription.json faviconData.json static',
      description: 'Generates the favicon in all possible formats, this should be run once only when ./static/logo.png changes',
    },
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
        script: npsUtils.series.nps('clean','build.build','build.favicon','build.minify'),
        description: 'Builds the documentation site',
      },
      build: {
        script: 'hugo --enableGitInfo --forceSyncStatic --gc --noChmod',
        description: 'Builds the hugo site',
        hiddenFromHelp: true,
      },
      favicon: {
        script: 'find ./public -type f -iname "*.html" -exec real-favicon inject faviconData.json public {} \\;',
        description: 'Injects the favicon into the html files',
        hiddenFromHelp: true,
      },
      minify: {
        script: 'find ./public -type f -iname "*.html" -exec htmlminify -o {} {} \\;',
        description: 'Minify the resulting html',
        hiddenFromHelp: true,
      },
    },
    dev_build: {
      default: {
        script: npsUtils.series.nps('clean', 'dev_build.build','dev_build.favicon'),
        description: 'Builds the documentation site',
      },
      build: {
        script: 'hugo --enableGitInfo --forceSyncStatic --gc --i18n-warnings --renderToMemory --templateMetrics --templateMetricsHints',
        description: 'Builds the hugo site',
        hiddenFromHelp: true,
      },
      favicon: {
        script: 'find ./public -type f -iname "*.html" -exec real-favicon inject faviconData.json public {} \\;',
        description: 'Injects the favicon into the html files',
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
