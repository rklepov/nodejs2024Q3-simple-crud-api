// src/http/streams.js

import { Writable } from 'node:stream';

export class RequestBodyStream extends Writable {
  constructor(opts) {
    super({ decodeStrings: false, defaultEncoding: 'utf8', ...opts });
    this.buffer = '';
  }

  _construct(callback) {
    callback();
  }

  _write(chunk, _, callback) {
    this.buffer += chunk;
    callback();
  }
}

//__EOF__
