# Server
This is the server component of the Stoutful project, which hosts the API. The server is built off of node and express.js.

## Getting Started
Run `npm install` to download all needed dependencies.

To start the server you can simply run `npm start` or `npm bin/www` but the recommended way is through Gulp.

Gulp is the build tool for this project and provides some nice conveniences for us such as restarting the server on file change. In order to use Gulp, you need to make sure it's installed.

```
npm -g install gulp
```
Once installed, you can then run `gulp serve`.

## Localtunnel
We use localtunnel in order to expose your local running server to the public domain of the web. This makes development on mobile easier since we don't need to use local IPs. Localtunnel is automatically executed on server start for **development environments only**. This should never be used in production.
