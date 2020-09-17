&nbsp;

&nbsp;

&nbsp;

&nbsp;

# Gloster #

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io) [![nps friendly](https://img.shields.io/badge/nps-friendly-blue.svg?style=flat-square)](https://github.com/sezna/nps) [![typescript](https://badgen.net/badge/icon/typescript?label=built%20with&color=yellow)](https://www.typescriptlang.org/) [![gitlab](https://badgen.net/badge/icon/gitlab?label=hosted%20on&color=orange)](https://gitlab.com/carddamom/gloster) [![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)

This is a project to manage other projects, in a very lightweight manner, meaning that this does not replace a repository manager, an issue tracker, a wiki or any other more heavyweight tool.

Its objective is just to:

- Have a set of projects;
- Those projects can be in a given state;
- Those projects can transition between the states as needed.

## Technical background ##

This project has two parts:

- Server side => The part running on the server or the backend;
- Client side => The part running on the user browser or the frontend;

These parts are managed on a monorepo and since they are based on the same language (typescript),
we use lerna to manage the monorepo.
Also common is the nps command to run scripts and the eslint definitions.

### Server Side ###

The server side is based on:

- node.js;
- typescript;
- koa;
- oclif;
- typeorm;
- ajv;

### Client Side ###

The client side is based on:

- webpack;
- vue.js;
- vuex;
- vue router;
- antd-for-vue;
- webbox (for service workers).

We also use typescript, pug and some scss.

## Developing ##

In order to work on gloster you need to have:

- node.js >= 12.14.1 (or the latest node LTS);
- npm;

Then run:

- npm install
- npm run boostrap

### Development build ###

In order to create a development build, type:

- npm run dev

This will:

1. Clean all remaining build artifacts;
2. Run webpack in development mode to create the client artifacts;
3. Copy the generated webpack files into the static folder ton the server project;
4. Build the server packages using oclif-dev pack;
5. Place the final artifacts on a folder in the root project.

### Development editor ###

For development it is recommended Visual Studio Code.

## Building ##

In order to create a release or production build run:

- npm run build

This will:

1. Clean all remaining build artifacts;
2. Run webpack in production mode to create the client artifacts;
3. Copy the generated webpack files into the static folder ton the server project;
4. Build the server packages using oclif-dev pack;
5. Place the final artifacts on a folder in the root project.

## License ##

The project itself is licensed under a AGPL3.0 or later license, as specified in LICENSE.md

Icon made by Freepik from www.flaticon.com
