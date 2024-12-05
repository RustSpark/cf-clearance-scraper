FROM node:latest

RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    apt-transport-https \
    chromium \
    chromium-driver \
    xvfb \
    && rm -rf /var/lib/apt/lists/*

## 添加 Chromium 的官方仓库
#RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
#    && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list
#
## 更新包列表并安装最新版本的 Chromium 和 Chromium 驱动
#RUN apt-get update && apt-get install -y \
#    chromium-browser \
#    chromium-chromedriver \

ENV CHROME_BIN=/usr/bin/chromium
#ENV CHROME_BIN=/usr/bin/chromium-browser

WORKDIR /app

COPY package*.json ./

RUN npm update
RUN npm install
RUN npm i -g pm2
COPY . .

EXPOSE 3000

CMD ["pm2-runtime", "src/index.js"]
