const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const masterSchema = new Schema(
    {
        name:String,
        email:String,
        mobile:String,
        price_point_value:Number,
        user_id:String, 
        merchant_id:String
    },{timestamps: true}
);

const UserMaster = mongoose.model('User_Master', masterSchema);

module.exports = UserMaster;