FROM centos:centos6

# Enable repository for Node.js
RUN curl --silent --location https://rpm.nodesource.com/setup | bash -

# Install Node.js (npm included) and build tools (to compile native packages)
RUN yum install -y nodejs gcc-c++ make

# Install dependencies
RUN npm install -g npm sails

# Creates a mount dir at /app
VOLUME /app

# Set working directory to /app
WORKDIR /app

# Expose port 1337
EXPOSE 1337

# Run /bin/bash when we start the container
CMD ["/bin/bash"]
