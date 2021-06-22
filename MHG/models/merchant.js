const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const merchantSchema = new Schema({
    id:
    {
        type: Number
    }
})


const Merchant = mongoose.model('Merchant', merchantSchema);

module.exports = Merchant;
