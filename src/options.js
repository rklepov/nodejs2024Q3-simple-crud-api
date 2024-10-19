// src/options.js

import path from 'node:path';

import { Exception } from './except.js';

// Exceptions //////////////////////////////////////////////////////////////////

export class CLIException extends Exception {}

export class InvalidOption extends CLIException {
  constructor(opt) {
    super(`the following option is unexpected: '${opt}'`);
  }
}

export class DuplicateOption extends CLIException {
  constructor(opt) {
    super(`the following option is duplicated: '${opt}'`);
  }
}

export class MissingOptionValue extends CLIException {
  constructor(opt) {
    super(`the following option(s) are missing value(s): [${opt}]`);
  }
}

export class InvalidOptionValue extends CLIException {
  constructor(opt, val) {
    super(`the value of '${opt}' is invalid: '${val}'`);
  }
}

// Defaults ////////////////////////////////////////////////////////////////////

const DEFAULT_SERVER_PORT = 3000;

/**
 * The very basic implementation of command-line options parser for the set of
 * hardcoded options specific for the task.
 * (just a single option in fact here so far - the server port number)
 */
export class Options {
  #serverPort = null;

  constructor(argv, env) {
    // the values passed via the command line take precedence
    while (0 < argv.length) {
      let arg = argv.shift();
      switch (arg) {
        case '-p':
        case '--port':
          if (this.#serverPort !== null) {
            throw new DuplicateOption(arg);
          }
          this.#serverPort = argv.shift();
          break;
        default:
          throw new InvalidOption(arg);
      }
    }

    // if not provided trying to set from the environment (or the default)
    this.#serverPort = this.#serverPort || env['PORT'] || DEFAULT_SERVER_PORT;

    this.validate();
  }

  get port() {
    return this.#serverPort;
  }

  validate() {
    // if the option flag is provided then it should be followed by a value
    let missingValues = [
      // TODO: option names duplication with constructor
      { name: '--port', value: this.#serverPort },
    ].filter((nv) => nv.value === undefined);
    if (0 < missingValues.length) {
      throw new MissingOptionValue(missingValues.map((nv) => nv.name));
    }

    // port should be a number within a valid range
    let port = Number(this.#serverPort);
    // the test works fine with NaN
    if (!(2 ** 0 <= port && port <= 2 ** 16)) {
      throw new InvalidOptionValue('--port', this.#serverPort);
    }
    this.#serverPort = port;
  }

  toString() {
    return `[${this.constructor.name}] serverPort: ${this.port}`;
  }

  static printUsage(argv, print) {
    print('Usage:');
    print(
      path.basename(argv[0]),
      path.basename(argv[1]),
      '[ -p|--port <port_number> ]',
    );
    print();
    print(
      `  <port_number>: ${2 ** 0}..${2 ** 16} | env: PORT | default: ${DEFAULT_SERVER_PORT}`,
    );
  }
}

export default {
  CLIException,
  DuplicateOption,
  InvalidOption,
  InvalidOptionValue,
  MissingOptionValue,
  Options,
};

//__EOF__
