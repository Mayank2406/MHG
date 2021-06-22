const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WalletSchema = new Schema({

});


const Wallet = mongoose.model('Wallet', WalletSchema);
module.exports = Wallet;