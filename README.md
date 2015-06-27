# Server
This is the server component of the Stoutful project, which hosts the API. The server is built off of node and express.js.

## Getting Started
Run `npm install` to download all needed dependencies.

To start the server you can simply run `sails lift` or `node app.js`.

## Migrations
Database migrations are handled through a tool called `sails-migrations`. In order to user it, it's recommended that you install it globally...

```
npm install -g sails-migrations
```

Once installed you can check the status of the migrations...

```
sails-migrations status
```

and then to run migrations...

```
sails-migrations migrate
```

To view all commands available, run `sails-migrations` without any arguments.

## Localtunnel
We use localtunnel in order to expose your local running server to the public domain of the web. This makes development on mobile easier since we don't need to use local IPs. It should automatically be started when you run either `sails lift` or `node app.js`. The default url we will be using is `stoutful.localtunnel.me`.
