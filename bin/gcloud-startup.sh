#!/usr/bin/env bash

set -v

# Talk to the metadata server to get the project id
PROJECT_ID=$(curl -s "http://metadata.google.internal/computeMetadata/v1/project/project-id" -H "Metadata-Flavor: Google")
PROJECT_DIR=/opt/app
NODE_VER=0.12.7

# Create an app user. The application will run as this user.
useradd -m -d /home/nodeapp nodeapp

# Install logging monitor. The monitor will automatically pick up logs sent to
# syslog.
curl -s "https://storage.googleapis.com/signals-agents/logging/google-fluentd-install.sh" | bash
service google-fluentd restart &

# Install system dependencies
apt-get update
apt-get install -yq ca-certificates git build-essential supervisor ruby-full postgresql-9.4
gem install sass

# Install node
if [ ! -f /usr/bin/node ]; then
  mkdir /opt/nodejs
  curl https://nodejs.org/dist/v$NODE_VER/node-v$NODE_VER-linux-x64.tar.gz | tar xvzf - -C /opt/nodejs --strip-components=1
  ln -s /opt/nodejs/bin/node /usr/bin/node
  ln -s /opt/nodejs/bin/npm /usr/bin/npm
  rm -rf /opt/nodejs
fi

# Install global app dependencies
npm set progress=false
npm install -g sails
npm install -g gulp
npm install -g knex
npm install -g bower

# Configure supervisor to run the node app.
cat >/etc/supervisor/conf.d/node-app.conf << EOF
[program:nodeapp]
directory=$PROJECT_DIR
command=start-stoutful
autostart=true
autorestart=true
user=nodeapp
environment=HOME="/home/nodeapp", USER="nodeapp", NODE_ENV="production", DB_URL="postgresql://postgres:9rCIs3p1kSvxg1nsauiy@10.240.0.3/stoutful", REDIS_HOST="10.240.0.4", ELASTICSEARCH_HOST="10.240.0.5"
stdout_logfile=/var/log/supervisor/supervisor.log
stderr_logfile=/var/log/supervisor/supervisor.error
EOF

# git requires $HOME and it's not set during the startup script.
export HOME=/root
git config --global credential.helper gcloud.sh

# Clone project if it doesn't exist
if ! [ -d "$PROJECT_DIR" ]; then
  git clone https://source.developers.google.com/p/$PROJECT_ID $PROJECT_DIR
  chown -R nodeapp:nodeapp $PROJECT_DIR
fi

# Switch to project directory
cd $PROJECT_DIR

# Ensure code base is at latest
git pull origin master

# Copy start script
cp docker/start /usr/bin/start-stoutful
chmod +x /usr/bin/start-stoutful

# Create supervisor log directory
mkdir /var/log/supervisor

# Restart supervisor
supervisorctl reload
