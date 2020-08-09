#!/usr/bin/env node

'use strict'

// eslint-disable-next-line no-unused-expressions
require('@oclif/command').run()
  .then(require('@oclif/command/flush'))
  .catch(require('@oclif/errors/handle'))
