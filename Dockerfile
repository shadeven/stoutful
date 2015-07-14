FROM    centos:centos6

# Enable repository for Node.js
RUN curl --silent --location https://rpm.nodesource.com/setup | bash -

# Install Node.js (npm included) and build tools (to compile native packages)
RUN yum install -y nodejs gcc-c++ make

# Bundle app source
COPY . /stoutful-server
# Install app dependencies
RUN cd /stoutful-server && npm install

EXPOSE  8080
CMD ["node", "stoutful-server/app.js"]
