// src/http/responses.js
//
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
//

class Response {
  #status = null;
  #contentType = 'application/json';

  constructor(status) {
    this.#status = status;
  }

  sendTo(serverResponse) {
    serverResponse.statusCode = this.#status;
    if (this.#contentType) {
      serverResponse.setHeader('content-type', this.#contentType);
    }
    return serverResponse.end(JSON.stringify(this.getBody()));
  }

  getBody() {
    return this._body();
  }

  _body() {
    return {};
  }

  setContentType(contentType) {
    this.#contentType = contentType;
    return this;
  }
}

// HTTP 200 ////////////////////////////////////////////////////////////////////

class SuccessfulResponse extends Response {
  #object = null;
  constructor(status, obj) {
    super(status);
    this.#object = obj;
  }

  _body() {
    return this.#object;
  }
}

// HTTP 400, 500 ///////////////////////////////////////////////////////////////

class ErrorResponse extends Response {
  #message = null;
  #details = null;

  constructor(status, msg, details) {
    super(status);
    this.#message = msg;
    this.#details = details;
  }

  _body() {
    let body = { ...super._body(), message: this.#message };
    if (this.#details) {
      body = { ...body, details: this.#details };
    }
    return body;
  }
}

// HTTP 400 ////////////////////////////////////////////////////////////////////

class ClientError extends ErrorResponse {}

// HTTP 500 ////////////////////////////////////////////////////////////////////

class ServerError extends ErrorResponse {}

export default {
  OK: (obj) => new SuccessfulResponse(200, obj),
  Created: (obj) => new SuccessfulResponse(201, obj),
  NoContent: () => new SuccessfulResponse(204).setContentType(''),

  BadRequest: (msg, details) => new ClientError(400, msg, details),
  NotFound: (msg, details) => new ClientError(404, msg, details),
  MethodNotAllowed: (msg, details) => new ClientError(405, msg, details),

  InternalError: (msg, details) => new ServerError(500, msg, details),
};

//__EOF__
