const log4js = require('log4js');
log4js.configure({
    appenders: {
        logstash: {
            type: 'km-log4js-logstash-tcp',
            host: 'localhost',
            port: 5000,
            service: {
                name: 'server_a',
                ip: '1.1.2.3',
                environment: process.env.NODE_ENV || 'development'
            }
        },
        console: { type: 'console' }
    },
    categories: {
        default: { appenders: ['logstash', 'console'], level: 'info' }
    }
});
export default log4js.getLogger();