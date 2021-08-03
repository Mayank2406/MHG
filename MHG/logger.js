const winston = require('winston');

module.exports.logger =  winston.createLogger({
    transports: [
      new winston.transports.File({
        format: winston.format.combine(winston.format.timestamp({format: 'MMM-DD-YYYY HH:mm:ss'}), winston.format.json()),
        level: 'info',
        filename: 'filelog-info.log',
        json: true,
      }),
      new winston.transports.File({
        format: winston.format.combine(winston.format.timestamp({format: 'MMM-DD-YYYY HH:mm:ss'}), winston.format.json()),
        level: 'error',
        filename: 'filelog-info.log',
        json: true,
      })
    ]
  });