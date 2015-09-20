FROM ubuntu:14.04

RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y curl

# For running the app
RUN curl --silent --location https://deb.nodesource.com/setup_0.12 | sudo bash -
RUN apt-get install -y nodejs git

# For building native npm packages
RUN apt-get install -y build-essential checkinstall python2.7
RUN ln -s /usr/bin/python2.7 /usr/bin/python

# For sass
RUN apt-get install -y ruby-full
RUN gem install sass

# For access to psql command
RUN apt-get install -y postgresql

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
