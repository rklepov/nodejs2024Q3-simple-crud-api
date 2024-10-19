// src/server.js

import http from 'node:http';

import { pipeline } from 'node:stream/promises';

import { Database } from './db.js';
import { Options } from './options.js';

import { PeopleRegistryHandler } from './http/endpoints/users/handler.js';
import HTTPResponse from './http/responses.js';
import { RequestBodyStream } from './http/streams.js';

class Server {
  #server = null;

  #opts = null;

  #database = new Database();

  #routes = {
    // TODO: the routing is simplistic
    api: { users: new PeopleRegistryHandler(['api', 'users'], this.#database) },
  };

  constructor(opts) {
    this.#opts = opts;
    this.#server = http.createServer(this.requestHandler.bind(this));
  }

  async requestHandler(req, res) {
    try {
      // taking the request header fields
      let method = req.method;
      let contentType = req.headers['content-type'];
      let url = new URL(req.url, `http://${req.headers.host}`);

      console.log(
        `[${new Date().toUTCString()}]`,
        `${method}, { ${contentType} }, [ ${url.pathname} ]`,
      );

      // checking the endpoint
      const path = url.pathname.split('/');

      if (path[1] !== 'api' || path[2] !== 'users') {
        HTTPResponse.NotFound("The resource doesn't exist on the server", {
          path,
        }).sendTo(res);
        return;
      }

      const endpoint = this.#routes[path[1]]?.[path[2]]; /* TODO: routing */

      // reading the request body
      const bodyStream = new RequestBodyStream();
      await pipeline(req, bodyStream);

      console.log(
        `[${new Date().toUTCString()}]`,
        `body(${bodyStream.buffer.length}):\n${bodyStream.buffer}`,
      );

      // processing the request
      endpoint
        .dispatch(
          method,
          req.headers,
          path.slice(3) /* TODO: routing */,
          bodyStream.buffer,
        )
        .sendTo(res);
    } catch (e) {
      console.error(`[${new Date().toUTCString()}]`, e);

      HTTPResponse.InternalError('Internal server error', {
        [e.constructor.name]: e.message,
      }).sendTo(res);

      // re-throwing the error will cause the server to stop
      // throw e;
    }
  }

  start() {
    return new Promise((resolve, reject) => {
      this.#server
        .listen(this.#opts.port)
        .on('listening', () => {
          resolve(this.#opts.port);
        })
        .on('error', (e) => {
          reject(e);
        });
    });
  }

  stop() {
    return new Promise((resolve, reject) => {
      this.#server.close((e) => {
        console.log(`[${new Date().toUTCString()}]`, 'Server closed');
        [resolve, reject][+!!e](e); // :-)
      });
    });
  }

  get httpServer() {
    return this.#server;
  }
}

async function main(argv, env) {
  try {
    const server = new Server(new Options(argv.slice(2), env));
    let port = await server.start();
    console.log(
      `[${new Date().toUTCString()}]`,
      `Server listening on port ${port}`,
    );
  } catch (e) {
    console.error(e.toString());
    console.error();
    Options.printUsage(argv.slice(0, 2), (...msg) => console.error(...msg));
    console.error();
    process.exitCode = 1; // ? can we do the process.exit in the top level module ?
  }
}

export { main };

//__EOF__
