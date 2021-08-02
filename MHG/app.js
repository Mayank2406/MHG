const express = require('express');
const config  = require('./config/config'); 
const mongodb = require('./config/databaseConnection')


// const mongoose = require('mongoose');

const merchantRoutes = require('./routes/merchant.route');
const walletRoutes = require('./routes/wallet.route');
const userMasterRoutes = require('./routes/userMaster.route');

const port = config.app.port;
const app = express();


const EventEmitter = require('events');
class MyEmitter extends EventEmitter{}
const myEmitter = new MyEmitter();
myEmitter.setMaxListeners(15);
myEmitter.emit('event');


mongodb.connect()
    .then((result) => app.listen(port, () => console.log(`Listening on port ${port}!`)))
    .catch((err) => { console.log(err) })

// mongoose.set('useFindAndModify', false);

// MiddleWare:
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/merchants', merchantRoutes);
app.use('/wallets', walletRoutes);
app.use('/masters', userMasterRoutes);