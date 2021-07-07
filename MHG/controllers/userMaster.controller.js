const UserService = require('../services/userMaster.service')

// userMaster_get:

const master_get = async (req, res) => {
    try {
        const users = await UserService.getUsers();
        if (users)
            return res.status(200).json({ length: users.length, status: 200, message: 'All users are fetched', data: users });
        else
            return res.status(404).json({ status: 404, message: "Can't Fetch Users" })
    }
    catch (e) {
        return res.status(400).json({ status: 400, message: e.message })
    }
}

// rank_get: 
const rank_get = async (req, res) => {
    const userId = req.params.userId
    try {
        const users = await UserService.getUserRank(userId);
        if (users) {
            var currentUserRank = {};
            for (let i = 0; i < users.length; i++) {
                if (users[i].user_id === userId) {
                    currentUserRank.user_id = userId,
                        currentUserRank.rank = users[i].rank,
                        currentUserRank.points = users[i].points
                }
            }
            if (users.length > 10) users.pop();
            return res.status(200).json({ length: users.length, status: 200, message: 'All users are fetched', data: users, currentUserRank });
        }
        else
            return res.status(404).json({ status: 404, message: "Can't Fetch Users" })
    }
    catch (e) {
        return res.status(400).json({ status: 400, message: e.message })
    }
}

// balance_get:

const balance_get = async (req, res) => {
    const mid = req.ex;                 // The mid is returned from merchant_auth and gets stored here.
    const userId = req.params.userId

    // Step1 : Authenticate the merchant_id:
    // Step2 : Check if the userId is present in the db.
    // Step3 : If (present) -----> return the balance.
    // Step4 : If (absent)  -----> Make a new account with given userId and balance 0.
    try {
        const userBalance = await UserService.getuserBalance(userId, mid);
        return res.status(200)
            .json({
                code: 2001,
                messsage: 'success',
                status: 'SUCCESS',
                balance: userBalance
            })
    }
    catch
    {
        return res.status(404)
            .json({
                code: 404,
                messsage: 'Fail',
                status: 'Fail',
            })
    }
}

// Debit Api:
const debit = async (req, res) => {
    const UserId = req.params.userId;
    const mid = req.ex;
    const query = req.body;

    try {
        const result = await UserService.getDebit({ UserId, mid, query });
        if (result) {
            return res.status(200)
                .json({
                    code: 2001,
                    message: 'SUCCESS',
                    status: 'SUCCESS'
                })
        }
        else {
            return res.status(400)
                .json({
                    message: 'Some error occurred'
                })
        }
    }
    catch (err) {
        return res.status(err.code)
            .json({
                code: err.code,
                messsage: err.message,
                status: err.status
            })
    }
};


// Credit Api:

const credit = async (req, res) => {

    const UserId = req.params.userId;
    const mid = req.ex;
    const query = req.body;

    try {
        const result = await UserService.getCredit({ UserId, mid, query });
        if (result) {
            return res.status(200)
                .json({
                    code: 2001,
                    message: 'SUCCESS',
                    status: 'SUCCESS'
                })
        }
        else {
            return res.status(400)
                .json({
                    message: 'Some error occurred'
                })
        }
    }
    catch (err) {
        return res.status(err.code)
            .json({
                code: err.code,
                messsage: err.message,
                status: err.status
            })
    }
};

// Transaction which occured w.r.t particular user_id:
const order_get = async (req, res) => {
    const userId = req.params.userId;
    try {
        const total_orders = await UserService.getTotalOrders(userId);
        const orders = await UserService.getOrders(userId);
        if (orders)
            return res.status(200).json({ length: total_orders.length, status: 200, message: 'All orders are fetched', data: orders });
        else
            return res.status(404).json({ status: 404, message: "Can't Fetch Orders" })
    }
    catch (e) {
        return res.status(400).json({ status: 400, message: e.message })
    }
}

module.exports = { master_get, balance_get, rank_get, debit, credit, order_get };