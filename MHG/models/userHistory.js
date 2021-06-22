const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userHistory_Schema = new Schema({
    first_name: { type: 'string', required: true },
    last_name: { type: 'string', required: true },
    roll_no: { type: Number, required: true },
});


const UserHistory = mongoose.model('User_History', userHistory_Schema);

module.exports = UserHistory;