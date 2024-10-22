// test/unit/db.test.js

import { validate as uuidValidate } from 'uuid';

import { Database } from '../../src/db.js';

describe('Basic database operations', () => {
  test('Positive db access scenario ', () => {
    let db = new Database();

    // create
    const key = db.create({ x: 1, y: 2 });
    expect(uuidValidate(key)).toBeTruthy();

    // read
    let {
      hasValue,
      value: { x, y },
    } = db.read(key);
    expect(hasValue).toBeTruthy();
    expect(x).toBe(1);
    expect(y).toBe(2);

    // update
    let {
      updated,
      value: { a, b },
    } = db.update(key, { a: 11, b: 22 });
    expect(updated).toBeTruthy();
    expect(a).toBe(11);
    expect(b).toBe(22);

    // delete
    let { deleted } = db.delete(key);
    expect(deleted).toBeTruthy();

    // list
    let list = db.ls();
    expect(list).toStrictEqual([]);
  });
});

//__EOF__
