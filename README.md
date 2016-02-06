# Server
This is the server component of the Stoutful project, which hosts the API. The server is built off of node and express.js.

## Getting Started
The best way to get started is with [Docker](https://www.docker.com/). Although you can run this project without it, we recommend using Docker to simplify the setup process and to ensure a consistent development environment.

Once you have Docker installed, you'll need to install [docker-compose](https://github.com/docker/compose/releases). We use `docker-compose` to orchestrate the various components together.

Finally, run `docker-compose up -d`. This will start up postgres, redis, elasticsearch, and then the app. At this point the app will be functional but it will not have any data. Scroll down to the "Seed Data" section for more.

If you need direct access to the web server, you can attach to it by running `docker exec -it <container_name> bash`. To figure out your web servers container name, run `docker-compose ps`. Please keep in mind that when you attach to the web server in this way, the app will still be running.

## Front End
The web front end is built using Angular (1.4.x). To compile all the assets together for the front end, simply run `gulp`. This will run pre-processors over all necessary files that make up the front end and write it out to the `dist/` directory. This will also watch for file changes and re-run the pre-processors.

## Port Forwarding (OSX and Windows only)
In order to access the server from your computer, you will need to setup port forwarding on the virtual machine.

```
VBoxManage modifyvm "boot2docker-vm" --natpf1 "tcp-port1337,tcp,,1337,,1337";
VBoxManage modifyvm "boot2docker-vm" --natpf1 "tcp-port5432,tcp,,5432,,5432";
VBoxManage modifyvm "boot2docker-vm" --natpf1 "tcp-port9200,tcp,,9200,,9200";
VBoxManage modifyvm "boot2docker-vm" --natpf1 "tcp-port9300,tcp,,9300,,9300";
VBoxManage modifyvm "boot2docker-vm" --natpf1 "tcp-port6379,tcp,,6379,,6379";
```

For **docker machine** users, replace `boot2docker-vm` with your VM name.

## Seed Data
We do have a set of initial seed data as SQL scripts. These SQL scripts are located in a separate repository: [stoutful/db-schema]( https://gitlab.com/stoutful/db-schema). Once you've imported the seed data, you must index it in order for search to work.

To index, run `gulp elasticsearch:index` inside the server docker container.

**NOTE:**
* The name of the repository can be misleading since it has nothing to do with the database schema. The name is simply an artifact from when it used to contain schema related tasks.
* Use the command line tool `psql` to run the SQL scripts.
