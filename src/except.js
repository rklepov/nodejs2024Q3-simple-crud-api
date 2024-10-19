// src/except.js

export class Exception extends Error {
  get name() {
    return this.constructor.name;
  }
}

//__EOF__
