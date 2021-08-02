const mongoose = require('mongoose');

const config  = require('./config');
const mongoUri = config.db.host;

const connect = () => {
    return mongoose.connect(mongoUri,{
        useNewUrlParser:true,
        useUnifiedTopology: true 
    });
};

module.exports = {
    connect:connect
}