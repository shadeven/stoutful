FROM ubuntu:14.04

# For running the app
RUN apt-get update
RUN apt-get install -y nodejs npm

# For building native npm packages
RUN apt-get install -y build-essential checkinstall

# For sass
RUN apt-get install -y ruby-full
RUN gem install sass

# For access to psql command
RUN apt-get install -y postgresql

RUN ln -s /usr/bin/nodejs /usr/bin/node

# Install dependencies
RUN npm install -g npm
RUN npm install -g gulp
RUN npm install -g sails

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
