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
import 'mocha';

import { expect, use } from 'chai';
import * as chaiarr from 'chai-arrays';
import chaipromise = require('chai-as-promised');
import chaifs = require('chai-fs');
import chaistr = require('chai-string');
import * as path from 'path';

import { ConfigurationImpl } from '../src/framework';

use(chaistr);
use(chaipromise);
use(chaiarr);
use(chaifs);

describe( 'Given a configuration file', () => {
  //JSON
  it('we should be able to parse a minimal json configuration file', () => {
    const empty_file = path.resolve(__dirname, 'empty.json');
    let config = ConfigurationImpl.fromFile(empty_file);
    expect(config).to.not.be.null;
  });

  it('we should not be able to parse an invalid json configuration file', (cb) => {
    try {
      const empty_file = path.resolve(__dirname, 'invalid.json');
      let config = ConfigurationImpl.fromFile(empty_file);
      expect(config).to.be.null;
      cb(new Error());
    } catch ( e ) {
      cb();
    }
  });

  it('we should be able to parse a valid json configuration file', () => {
    const empty_file = path.resolve(__dirname, 'valid.json');
    let config = ConfigurationImpl.fromFile(empty_file);
    expect(config).to.not.be.null;
    expect(config.server.session.maxAge).to.equal(1800001);
  });

  //YAML
  it('we should be able to parse a minimal yaml configuration file', () => {
    const empty_file = path.resolve(__dirname, 'empty.yml');
    let config = ConfigurationImpl.fromFile(empty_file);
    expect(config).to.not.be.null;
  });

  it('we should not be able to parse an invalid yaml configuration file', (cb) => {
    try {
      const empty_file = path.resolve(__dirname, 'invalid.yml');
      let config = ConfigurationImpl.fromFile(empty_file);
      expect(config).to.be.null;
    } catch (e) {
      cb();
    }
  });

  it('we should be able to parse a valid yaml configuration file', () => {
    const empty_file = path.resolve(__dirname, 'valid.yml');
    let config = ConfigurationImpl.fromFile(empty_file);
    expect(config).to.not.be.null;
    expect(config.server.session.maxAge).to.equal(1800001);
  });

  //TOML
  it('we should be able to parse a minimal toml configuration file', () => {
    const empty_file = path.resolve(__dirname, 'empty.toml');
    let config = ConfigurationImpl.fromFile(empty_file);
    expect(config).to.not.be.null;
  });

  it('we should not be able to parse an invalid toml configuration file', (cb) => {
    try {
      const empty_file = path.resolve(__dirname, 'invalid.toml');
      let config = ConfigurationImpl.fromFile(empty_file);
      expect(config).to.be.null;
    } catch (e) {
      cb();
    }
  });

  it('we should be able to parse a valid toml configuration file', () => {
    const empty_file = path.resolve(__dirname, 'valid.toml');
    let config = ConfigurationImpl.fromFile(empty_file);
    expect(config).to.not.be.null;
    expect(config.server.session.maxAge).to.equal(1800001);
  });
});
