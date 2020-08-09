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
    license: {
      script: 'license-checker',
      description: 'checks the licenses of this package',
    },
    clean: {
      default: {
        script: npsUtils.concurrent.nps('clean.local', 'clean.server'),
        description: 'clears the build artifacts',
      },
      local: {
        script: npsUtils.rimraf('dist/'),
        description: 'clears the build directory',
        hiddenFromHelp: true,
      },
      server: {
        script: npsUtils.rimraf('../server/static/'),
        description: 'clears the server static directory',
        hiddenFromHelp: true,
      },
    },
    build: {
      default: {
        script: npsUtils.series.nps('clean', 'build.run', 'build.post'),
        description: 'executes a client build',
      },
      run: {
        script: 'parcel build ./src/index.pug',
        description: 'builds the parcel stuff into dist',
        hiddenFromHelp: true,
      },
      post: {
        script: npsUtils.ncp('"dist/" "../server/static"'),
        description: 'copies the generated dist files into the server root',
        hiddenFromHelp: true,
      },
    },
    dev: {
      default: {
        script: npsUtils.series.nps('clean', 'dev.run', 'dev.post'),
        description: 'executes a client build in development mode',
      },
      run: {
        script: 'parcel build --no-minify ./src/index.pug',
        description: 'builds the parcel stuff into dist in development mode',
        hiddenFromHelp: true,
      },
      post: {
        script: npsUtils.ncp('"dist/" "../server/static"'),
        description: 'copies the generated dist files into the server root',
        hiddenFromHelp: true,
      },
    },
  },
}
