# RS School 2024Q3 [NodeJS Course](https://github.com/rolling-scopes-school/tasks/tree/master/node 'RS School. Node.js Course')

## [Simple CRUD API](https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/crud-api/assignment.md 'Simple CRUD API')

This is the implementation of the simple CRUD API web server which uses in-memory database.

### Requirements

The assumption is that **node** `^22.9.0` is used.

### Installation

1. Clone the repo:

   ```shell
   git clone https://github.com/rklepov/nodejs2024Q3-simple-crud-api.git
   ```

1. Go to the directory with the repo created on step 1.
1. Switch to `develop` branch:

   ```shell
   git checkout develop
   ```

1. Install the dependencies with `npm`:

   ```shell
   npm install
   ```

### Usage

1. Create `.env` file in the root directory of the repo to configure the server port number (you can use the provided [`.env.example`](https://github.com/rklepov/nodejs2024Q3-simple-crud-api/blob/develop/.env.example) as a reference).
1. Start the server either in _dev_ mode under [**nodemon**](https://www.npmjs.com/package/nodemon) with `npm run start:dev` command or in _prod_ mode (as a [**webpack**](https://webpack.js.org/concepts) bundle) with `npm run start:prod`. In either case the result should be the same: the server starts listening on the port provided in _p_.1.
1. You can send a request to the API using the following endpoints: `http://localhost:<port>/api/users/<id>` and `http://localhost:<port>/api/users`.
1. It's recommended to use [**Postman**](https://learning.postman.com/docs/getting-started/installation-and-updates/) API client tool to send the requests to the server.
1. You can make GET, POST, PUT, and DELETE requests (and also PATCH as an extra feature).
1. The format of the requests follows the task [requirements](https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/crud-api/assignment.md 'Simple CRUD API'). The body of POST and PUT requests should have the schema:

   ```json
   {
     "username": string,
     "age": number,
     "hobbies": [array of strings or an empty array]
   }
   ```

   For example:

   ```json
   {
     "username": "John Silver",
     "age": 40,
     "hobbies": ["maps", "parrots", "rum"]
   }
   ```

   ⚠️ I don't perform thorough validation of the user object passed with POST and PUT requests: just check that the 3 required fields from the task description are present but don't check their types. My point here is that implementing good schema validation logic is far beyond the scope of this educational task. And simply testing the types of the object properties with certain names is just not interesting and again not directly related to the purpose of the exercise. So I deliberately decided to omit this piece.

   💡 Try making a POST request to `http://localhost:<port>/api/users` with `"username": "Harry Potter"` to check _500 Internal server error_ scenario.

1. Remember that the database is in-memory meaning that its contents is lost with the server restart.

### Testing

```shell
npm run test
```
