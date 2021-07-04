// For updating balance in UserMaster collection:
const UserMaster = require('../models/userMaster');

const UserService = require('../services/userMaster')


// For mer_id validation:
const Merchants = require('../models/merchant');


// for updating in user_history :
const UserHistory = require('../models/userHistory');


// for updating revenue in wallet collection:
const Wallet = require('../models/wallet');


// userMaster_get:

const master_get = async (req, res) => {
    try {
        const users = await UserService.getUsers();
        if (users)
            return res.status(200).json({ status: 200, message: 'All users are fetched', data: users });
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

const credit = async(req, res) => {

    const UserId = req.params.userId;
    const mid    = req.ex;
    const query  = req.body;
    
    try {
        const result = await UserService.getCredit({UserId, mid, query});
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
    catch(err) 
    {
        return res.status(err.code)
        .json({
            code: err.code,
            messsage: err.message,
            status: err.status
        })
    }
};

module.exports = { master_get, balance_get, debit, credit };