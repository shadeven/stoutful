FROM node:0.12.7-wheezy

RUN apt-get update
RUN apt-get -y upgrade

# For running the app
RUN apt-get -y install git

# For building native npm packages
RUN apt-get -y install build-essential

# For SASS
RUN apt-get -y install ruby-full
RUN gem install sass

# For access to psql command
RUN apt-get -y install postgresql

RUN npm install -g sails
RUN npm install -g knex

# Creates a mount dir at /app
VOLUME /app

# Set working directory to /app
WORKDIR /app

# Copy start script
COPY start /usr/local/bin/start-stoutful

# Expose port 1337
EXPOSE 1337

# Run /bin/bash when we start the container
CMD ["start-stoutful"]
