const userHistory = require('../models/userHistory.model');

const user_get = (req, res) => {
    userHistory.find()
        .then(users => res.status(200).json(
            {
                messsage: "all users are fetched",
                users: users
            }
        ))
        .catch(err => res.status(404).json({ messsage: err }));
}

const user_post = (req, res) => {
    const users = new userHistory(req.body);
    users.save()
        .then(users => res.status(200).json({ messsage: "users saved", users: users }))
        .catch(err => res.status(404).json({ messsage: err }));
}

module.exports = { user_get, user_post };