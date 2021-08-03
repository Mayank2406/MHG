const UserService = require('../services/userMaster.service')
const { logger } = require("../logger");
const { response } = require('express');
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

// coins_get:

const coins_get = async (req, res) => {
    var Url = req.protocol + '://' + req.get('host') + req.originalUrl;
    const mid = req.params.merchantId;
    try {
        const Summary = await UserService.getcoinsSummary(mid);
        if (Summary) {

            const response = {
                code: 2001,
                message: 'SUCCESS',
                status: 'SUCCESS',
                summary: Summary
            }


            logger.info(`Request is [${Url}] [${req.method}]`)
            logger.info(`Response is ${JSON.stringify(response)}`)

            return res.status(200).json({ response: response })
        }
        else {
            return res.status(400)
                .json({
                    message: 'Some error occurred'
                })
        }
    }
    catch (err) {
        const error = {
            code: err.code,
            messsage: err.message,
            status: err.status
        }

        logger.error(err.stack || error)

        return res.status(err.code)
            .json({ error: error })
    }
}


// rank_get: 
const rank_get = async (req, res) => {
    var Url = req.protocol + '://' + req.get('host') + req.originalUrl;
    const mid = req.params.merchantId
    const userId = req.params.userId
    try {
        const users = await UserService.getUserRank(mid, userId);
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

            const response = {
                length: users.length, status: 200, message: 'All users are fetched', data: users, currentUserRank
            }

            logger.info(`Request is [${Url}] [${req.method}]`)
            logger.info(response)

            return res.status(200).json({ response: response });
        }
        else
            return res.status(404).json({ status: 404, message: "Can't Fetch Users" })
    }
    catch (e) {
        const error = { status: 400, message: e.message }
        logger.error(err.stack || error)
        return res.status(400).json({ error: error })
    }
}

// balance_get:

const balance_get = async (req, res) => {
    var Url = req.protocol + '://' + req.get('host') + req.originalUrl;

    const mid = req.params.merchantId;                 // The mid is returned from merchant_auth and gets stored here.
    const userId = req.params.userId

    // Step1 : Authenticate the merchant_id:
    // Step2 : Check if the userId is present in the db.
    // Step3 : If (present) -----> return the balance.
    // Step4 : If (absent)  -----> Make a new account with given userId and balance 0.
    try {
        const userBalance = await UserService.getuserBalance(userId, mid);

        const response = {
            code: 2001,
            messsage: 'success',
            status: 'SUCCESS',
            balance: userBalance
        }

        logger.info(`Request is [${Url}] [${req.method}]`)
        logger.info(response)

        return res.status(200).json({ response: response })
    }
    catch (err) {
        const error = {
            code: err.code,
            messsage: err.message,
            status: err.status,
        }

        logger.error(err.stack)
        return res.status(404).json({ error: error })
    }
}

// Debit Api:
const debit = async (req, res) => {

    var Url = req.protocol + '://' + req.get('host') + req.originalUrl;
    const UserId = req.params.userId;
    const mid = req.params.merchantId;
    const query = req.body;

    try {
        const result = await UserService.getDebit({ UserId, mid, query });
        if (result) {
            const response = {
                code: 2001,
                message: 'SUCCESS',
                status: 'SUCCESS'
            }

            logger.info(`Request is [${Url}] [${req.method}] [${JSON.stringify(req.body)}]`)
            logger.info(`Response is ${JSON.stringify(response)}`)

            return res.status(200).json({ result: response });
        }
        else {
            return res.status(400)
                .json({
                    message: 'Some error occurred'
                })
        }
    }
    catch (err) {

        const error = {
            code: err.code,
            messsage: err.message,
            status: err.status
        }

        logger.error(err.stack || error)
        return res.status(err.code).json({ error: error })
    }
};


// Credit Api:

const credit = async (req, res) => {

    var Url = req.protocol + '://' + req.get('host') + req.originalUrl;
    const UserId = req.params.userId;
    const mid = req.params.merchantId;
    const query = req.body;

    try {
        const result = await UserService.getCredit({ UserId, mid, query });
        if (result) {
            const response = {
                code: 2001,
                message: 'SUCCESS',
                status: 'SUCCESS'
            }

            logger.info(`Request is [${Url}] [${req.method}] [${JSON.stringify(req.body)}]`)
            logger.info(`Response is ${JSON.stringify(response)}`)

            return res.status(200).json({ result: response })
        }
        else {
            return res.status(400)
                .json({
                    message: 'Some error occurred'
                })
        }
    }
    catch (err) {

        const error = {
            code: err.code,
            messsage: err.message,
            status: err.status
        }

        logger.error(err.stack || error)
        return res.status(404).json({ error: error })
    }
};

// Transaction which occured w.r.t particular user_id:
const order_get = async (req, res) => {
    var Url = req.protocol + '://' + req.get('host') + req.originalUrl;
    const userId = req.params.userId;
    let page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);

    try {
        const total_orders = await UserService.getTotalOrders(userId);
        const orders = await UserService.getOrders({ total_orders, userId, page, limit });
        if (orders) {
            const response = { Total_Orders: total_orders.length, status: 200, message: 'All orders are fetched', Orders: orders }
            logger.info(`Request is [${Url}] [${req.method}]`)
            logger.info(`Response is ${JSON.stringify(response)}`)
            return res.status(200).json({ response: response });
        }
        else
            return res.status(404).json({ status: 404, message: "Can't Fetch Orders" })
    }
    catch (e) {
        const error = { status: 400, message: e.message }
        logger.error(e.stack || error);
        return res.status(400).json({ error: error })
    }
}

// Check if order exist or not

const checkOrder = async (req, res) => {
    var Url = req.protocol + '://' + req.get('host') + req.originalUrl;
    const orderId = req.params.orderId;
    try {
        const order = await UserService.checkOrder(orderId);
        if (order) {
            const response = { code: 200, status: 'Success', message: 'Order already exist' }
            logger.info(`Request is [${Url}] [${req.method}]`)
            logger.info(`Response is ${JSON.stringify(response)}`)
            return res.status(200).json({ response: response })
        }
        else {
            const response = { code: 200, status: 'Success', message: 'Order does not exist' }
            logger.info(`Request is [${Url}] [${req.method}]`)
            logger.info(`Response is ${JSON.stringify(response)}`)
            return res.status(200).json({ response: response })
        }
    }
    catch (e) {
        const error = { status: 400, message: e.message }
        logger.error(e.stack || error)
        return res.status(400).json({error: error})
    }
}

module.exports = { master_get, balance_get, rank_get, debit, credit, order_get, coins_get, checkOrder };