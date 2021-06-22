// importing wallet model:

const Wallet = require('../models/wallet');


// wallet_get:

const wallet_get = (req, res) => {
    Wallet.find()
        .then((result) => { res.status(200).json({ message: 'all records fetched', result: result }) })
        .catch((err) => { res.status(404).json({ message: err }) });
}

module.exports = { wallet_get }