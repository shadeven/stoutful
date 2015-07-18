# Server
This is the server component of the Stoutful project, which hosts the API. The server is built off of node and express.js.

## Getting Started
Run `npm install` to download all needed dependencies.

To start the server you can simply run `sails lift` or `node start`.

## Migrations
Database migrations are handled through a tool called `sails-migrations`. Migrations only handle schema creations and schema updates. It will **NOT** import any data.

In order to use `sails-migrations`, you must install it globally...

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

## Seed Data
We do have a set of initial seed data as SQL scripts. These SQL scripts are located in a separate repository: [stoutful/db-schema]( https://gitlab.com/stoutful/db-schema).

**NOTE:** The name of the repository can be misleading since it has nothing to do with the database schema. The name is simply artifact from when it used to contain schema related tasks.

## Docker

Included in the project is a `Dockerfile` which you can use to create a Docker container that will run the server instead of running it directly on your machine. The main benefit of doing this is getting a consistent running server. To get started, simply run

```
docker build -t stoutful-server .
```

Once it's done building, you need to run the following applications which `stoutful-server` will link to.

```
docker run --name stoutful-postgres -p 5432:5432 -d postgres
docker run --name stoutful-elasticsearch -p 9200:9200 -p 9300:9300 -d elasticsearch
docker run --name stoutful-redis -p 6379:6379 -d redis
```

Then you can run stoutful-server using...

```
docker run -it --name stoutful-server -v /path/to/stoutful-server:/app -p 1337:1337 --link stoutful-redis:stoutful_redis --link stoutful-elasticsearch:stoutful_elasticsearch --link stoutful-postgres:stoutful_postgres stoutful-server
```

**NOTE:** If you're on Windows, you must use double forward slashes (`//`) when specifying the volume source path, e.g. `//c/path/to/stoutful-server`.

This should drop you into a bash shell of the running Docker container. From here, you can run the server as usual using `npm start`.

### Note for OSX and Windows users

Since OSX and Windows cannot natively run Docker, you must run Docker through either [boot2docker](http://boot2docker.io/) or [docker machine](https://docs.docker.com/machine/). Because of this, you need to set up port forwarding in order to access the server, redis, postgres, and elasticsearch from your computer:

```
VBoxManage modifyvm "boot2docker-vm" --natpf1 "tcp-port1337,tcp,,1337,,1337";
VBoxManage modifyvm "boot2docker-vm" --natpf1 "tcp-port5432,tcp,,5432,,5432";
VBoxManage modifyvm "boot2docker-vm" --natpf1 "tcp-port9200,tcp,,9200,,9200";
VBoxManage modifyvm "boot2docker-vm" --natpf1 "tcp-port9300,tcp,,9300,,9300";
VBoxManage modifyvm "boot2docker-vm" --natpf1 "tcp-port6379,tcp,,6379,,6379";
```

For **docker machine** users, replace `boot2docker-vm` with your VM name.
