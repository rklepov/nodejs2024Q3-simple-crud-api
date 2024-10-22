// src/db.js

import { v4 as uuidv4 } from 'uuid';

/**
 * Simple in-memory key-value storage. The implementation is based on Map which
 * keys are string representations of UUID.
 * TODO: apparently it's not very efficient to use string UUIDs as keys. However
 * for the sake of simplicity and the ability to use Map I've decided to
 * keep this solution for the time being.
 */
export class Database {
  #db = new Map();

  create(value) {
    let key = uuidv4();
    this.#db.set(key, value);
    return key;
  }

  read(key) {
    let value = this.#db.get(key);
    return { hasValue: !!value, value };
  }

  update(key, value) {
    if (this.#db.has(key)) {
      this.#db.set(key, value);
      return { updated: true, value };
    } else {
      return { updated: false };
    }
  }

  delete(key) {
    return { deleted: this.#db.delete(key) };
  }

  ls() {
    return [...this.#db.entries()].map(([id, obj]) => ({ id, ...obj }));
  }
}

//__EOF__
