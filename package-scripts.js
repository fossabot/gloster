// Copyright (C) 2020 carddamom
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

const npsUtils = require('nps-utils')

module.exports = {
  scripts: {
    coverage: {
      script: npsUtils.series('cd ./packages/server', 'yarn run coverage'),
      description: 'runs the tests with coverage enable',
    },
    test: {
      script: npsUtils.series('cd ./packages/server', 'yarn run test'),
      description: 'runs the tests',
    },
    co: {
      script: 'git-cz',
      description: 'creates a commit using commitizen'
    },
    license: {
      script: 'license-checker',
      description: 'checks the licenses of this package',
    },
    clean: {
      default: {
        script: npsUtils.concurrent.nps('clean.client','clean.server'),
        description: 'cleans all the build files either from development or production mode',
      },
      client: {
        script: npsUtils.series('cd ./packages/client','yarn run clean'),
        description: 'cleans the client build files',
        hiddenFromHelp: true,
      },
      server: {
        script: npsUtils.series('cd ./packages/server','yarn run clean'),
        description: 'cleans the server build files',
        hiddenFromHelp: true,
      },
    },
    build: {
      default: {
        script: npsUtils.series.nps('clean','build.client','build.server','build.post'),
        description: 'builds a gloster package using the production mode',
      },
      client: {
        script: npsUtils.series('cd ./packages/client','yarn run build'),
        description: 'generates a client build in production mode',
        hiddenFromHelp: true,
      },
      server: {
        script: npsUtils.series('cd ./packages/server','yarn run build'),
        description: 'generates the server build',
        hiddenFromHelp: true,
      },
      post: {
        default: {
          script: npsUtils.series.nps('build.post.mkdir','build.post.copy','build.post.delete'),
          description: 'moves the generated packages into the root directory',
          hiddenFromHelp: true,
        },
        mkdir: {
          script: npsUtils.mkdirp('./dist'),
          description: 'creates the dist directory',
          hiddenFromHelp: true,
        },
        copy: {
          script: npsUtils.ncp('./packages/server/dist ./dist'),
          description: 'copies the generated packages into the root directory',
          hiddenFromHelp: true,
        },
        delete: {
          script: npsUtils.rimraf('./packages/server/dist/'),
          description: 'deletes the server dist folder',
          hiddenFromHelp: true,
        },
      },
    },
    dev: {
      default: {
        script: npsUtils.series.nps('clean','dev.client','dev.server','dev.post'),
        description: 'builds a gloster package using the development mode',
      },
      client: {
        script: npsUtils.series('cd ./packages/client','yarn run dev'),
        description: 'generates a client build in development mode',
        hiddenFromHelp: true,
      },
      server: {
        script: npsUtils.series('cd ./packages/server','yarn run build'),
        description: 'generates the server build',
        hiddenFromHelp: true,
      },
      post: {
        default: {
          script: npsUtils.series.nps('build.post.mkdir','build.post.copy','build.post.delete'),
          description: 'moves the generated packages into the root directory',
          hiddenFromHelp: true,
        },
        mkdir: {
          script: npsUtils.mkdirp('mkdir ./dist'),
          description: 'creates the dist directory',
          hiddenFromHelp: true,
        },
        copy: {
          script: npsUtils.ncp('./packages/server/dist ./dist'),
          description: 'copies the generated packages into the root directory',
          hiddenFromHelp: true,
        },
        delete: {
          script: npsUtils.rimraf('./packages/server/dist/'),
          description: 'deletes the server dist folder',
          hiddenFromHelp: true,
        },
      },
    },
  },
};
