# Server
This is the server component of the Stoutful project, which hosts the API. The server is built off of node and express.js.

## Getting Started
Run `npm install` to download all needed dependencies.

To start the server you can simply run `sails lift` or `node start`.

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

## Docker

Included in the project is a `Dockerfile` which you can use to create a Docker container that will run the server instead of running it directly on your machine. The main benefit of doing this is getting a consistent running server. To get started, simply run

```
docker build -t stoutful-server .
```

Once it's done building, you can run it using

```
docker run -it --name stoutful-server -v $(pwd):/app -p 1337:1337 --link stoutful-redis:stoutful_redis --link stoutful-elasticsearch:stoutful_elasticsearch --link stoutful-postgres:stoutful_postgres stoutful-server
```

This should drop you into a bash shell of the running Docker container. From here, you can run the server as usual using `npm start`.

### Note for OSX and Windows users

Since OSX and Windows cannot natively run Docker, you must run Docker through either [boot2docker](http://boot2docker.io/) or [docker machine](https://docs.docker.com/machine/). Because of this, you need to set up port forwarding in order to access the server from your computer:

```
VBoxManage modifyvm "boot2docker-vm" --natpf1 "tcp-port1337,tcp,,1337,,1337";
```

For **docker machine** users, replace `boot2docker-vm` with your VM name.
