FROM ubuntu:18.04
USER 0

ENV DEBIAN_FRONTEND=noninteractive

RUN apt update \
&& apt-get -my install gnupg curl \
&& curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
&& echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list \
&& apt update \
&& apt-get -y install nodejs npm yarn \
&& yarn config set registry https://registry.npm.taobao.org/ \
&& yarn global add n pm2 \
&& n lts \
&& apt -y autoremove

WORKDIR /var/www/src
CMD pm2 start /var/www/src/app.js --no-daemon
EXPOSE 7998
MAINTAINER Claim Yang, ywtyx01@126.com
