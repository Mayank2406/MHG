const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const walletHistory_Schema = new Schema({
    description:String,                     // Debit: Played ,  Credit:Won 
    trasaction_type:String,                 // Debit or Credit
    source:String,                          // Game/app
    user_id:String,                         
    merchant_id:String,
    order_id:String,
    wallet_id:String,                       // This is ObjectId of Wallet                                     
    price_point_value:Number,               // Debit or Credit amount
    last_updated_playpoint:Number,          // Actual Balance
    user_action:String,                     // Debit: Play,  Credit:Win
},{timestamps: true});


const WalletHistory = mongoose.model('Wallet_History', walletHistory_Schema);

module.exports = WalletHistory;