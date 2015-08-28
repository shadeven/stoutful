FROM centos:centos6

# Enable repository for Node.js
RUN curl --silent --location https://rpm.nodesource.com/setup | bash -

# For running the app
RUN yum install -y nodejs

# For building native npm packages
RUN yum install -y gcc-c++ make

# For access to psql command
RUN yum install -y postgresql

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
