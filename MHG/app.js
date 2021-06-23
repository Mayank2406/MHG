const express = require('express');
const mongoose = require('mongoose');

const merchantRoutes = require('./routes/merchant');
const userHistoryRoutes = require('./routes/userHistory');
const walletRoutes = require('./routes/walletroute');
const userMasterRoutes = require('./routes/userMaster');

const port = 3000;
const app = express();


const dbURL = "mongodb+srv://m2406:whJaqTam7AwRUut@cluster0.9gkt2.mongodb.net/MHJ";
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => app.listen(port, () => console.log(`Listening on port ${port}!`)))
    .catch((err) => { console.log(err) })

    mongoose.set('useFindAndModify', false);
// MiddleWare:
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/merchants', merchantRoutes);
app.use('/users', userHistoryRoutes);
app.use('/wallets', walletRoutes);
app.use('/masters', userMasterRoutes);