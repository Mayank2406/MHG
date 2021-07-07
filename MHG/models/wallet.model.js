const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WalletSchema = new Schema({
    mid:String,
    wallet_type:String,
    price_point_value:Number
},{timestamps: true});


const Wallet = mongoose.model('Wallet', WalletSchema);
module.exports = Wallet;