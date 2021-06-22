const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const masterSchema = new Schema(
    {

    }
);

const UserMaster = mongoose.model('User_Master', masterSchema);

module.exports = UserMaster;