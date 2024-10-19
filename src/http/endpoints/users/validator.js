// src/http/endpoints/person/validator.js

import { validate as uuidValidate } from 'uuid';

import HTTPResponse from '../../responses.js';

class PersonRequestValidator {
  #method = '';
  #headers = [];
  #path = [];

  #id = '';
  #object = null;

  #response = null;

  constructor(method, headers, path) {
    this.#method = method;
    this.#headers = headers;
    this.#path = path;
  }

  checkPath(minLen, maxLen) {
    let path = this.#path;

    if (!(minLen <= path.length && path.length <= maxLen)) {
      this.#response = HTTPResponse.NotFound(
        `Invalid resource for ${this.#method}`,
        { path },
      );
    }
    return !this.#response;
  }

  checkContentType(expected) {
    const contentTypeKey = 'content-type';
    let contentTypeVal = this.#headers[contentTypeKey];
    if (!contentTypeVal?.match(new RegExp(expected))) {
      this.#response = HTTPResponse.BadRequest(
        `Unsupported request content type for ${this.#method}`,
        {
          [contentTypeKey]: contentTypeVal,
          expected,
        },
      );
    }
    return !this.#response;
  }

  checkId() {
    let id = this.#path[0];
    if (!uuidValidate(id)) {
      this.#response = HTTPResponse.BadRequest('Invalid person Id', { id });
    } else {
      this.#id = id;
    }
    return !this.#response;
  }

  checkJsonObject(body) {
    try {
      this.#object = JSON.parse(body);
      return true;
    } catch (e) {
      if (e instanceof SyntaxError) {
        this.#response = HTTPResponse.BadRequest('JSON parse failed', {
          [e.constructor.name]: e.message,
        });
        return false;
      }
      // some unexpected exception, will be handled by internal server error handler
      throw e;
    }
  }

  allObjectFieldsPresent(fields) {
    let missing = fields.filter(
      (field) => !Object.keys(this.#object).includes(field),
    );
    if (0 < missing.length) {
      this.#response = HTTPResponse.BadRequest(
        `Not all mandatory fields provided for ${this.#method}`,
        {
          missing,
        },
      );
    }
    return 0 >= missing.length;
  }

  get path() {
    return this.#path;
  }

  get id() {
    return this.#id;
  }

  get object() {
    return this.#object;
  }

  get response() {
    return this.#response;
  }
}

export default PersonRequestValidator;

//__EOF__
