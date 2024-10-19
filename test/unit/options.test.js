// test/unit/options.test.js

import options from '../../src/options.js';

describe('Server port number', () => {
  describe('When passed via the command line', () => {
    test('Port number passed via the short option', () => {
      let opts = new options.Options(['-p', '1234'], {});
      expect(opts.port).toBe(1234);
    });

    //     test.todo('Port number passed via the long option');
    //
    //     test.todo('Port number option duplicated');
    //
    //     test.todo('Unexpected option passed via the command line');
    //
    //     test.todo('Incorrect port number passed via the command line');
  });

  describe('When passed via the environment', () => {
    test('Port number passed via the environment variable', () => {
      let opts = new options.Options([], { PORT: '5555' });
      expect(opts.port).toBe(5555);
    });

    test('Incorrect value in the environment variable', () => {
      try {
        new options.Options([], { PORT: '5555;' });
      } catch (e) {
        expect(e).toBeInstanceOf(options.InvalidOptionValue);
        expect(e.message).toBe("the value of '--port' is invalid: '5555;'");
      }
    });
  });

  describe('Default value', () => {
    test('Port number set to the default value if not provided explicitly', () => {
      let opts = new options.Options([], {});
      expect(opts.port).toBe(3000);
    });
  });
});

//__EOF__
