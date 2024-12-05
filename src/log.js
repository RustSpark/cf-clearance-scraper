const pino = require('pino');
const fs = require('fs');

// 创建一个写入流，指向日志文件
const logStream = fs.createWriteStream('/opt/logs/cloudflare.log', {flags: 'a'});

// 创建一个 pino logger 实例，并将输出流定向到文件
const logger = pino(logStream);
module.exports = logger;