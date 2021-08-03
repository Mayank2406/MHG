const MerchantService = require('../services/merchant.service');
const { logger } = require("../logger");

const settlement = async (req, res) => {

    var Url = req.protocol + '://' + req.get('host') + req.originalUrl;

    const wallet_type = req.params.wallet_type;
    const query = req.body;
    const mid = req.params.merchantId;
    try {
        const settlement = await MerchantService.settleWallet({ wallet_type, query, mid });
        if (settlement) {
            const response = {
                code: 2001,
                message: 'SUCCESS',
                status: 'SUCCESS',
            }

            logger.info(`Request is [${Url}] [${req.method}] [${JSON.stringify(req.body)}]`)
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
        return res.status(err.code).json({ error: error })
    }
}

const getTransactionSummary = async (req, res) => {

    var Url = req.protocol + '://' + req.get('host') + req.originalUrl;
    const mid = req.params.merchantId;
    try {
        const Summary = await MerchantService.getcoinsSummary(mid);
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

const getHistoryPoints = async (req, res) => {
    var Url = req.protocol + '://' + req.get('host') + req.originalUrl;

    let page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);
    const mid = req.params.merchantId;
    try {
        const Total_Orders = await MerchantService.getallOrders(mid);
        const HistoryPoints = await MerchantService.getHistoryPoints({ Total_Orders, mid, page, limit });
        if (HistoryPoints) {

            const response = {
                code: 2001,
                total_orders: Total_Orders.length,
                message: 'SUCCESS',
                status: 'SUCCESS',
                summary: HistoryPoints
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
            code: 400,
            messsage: err.message,
        }

        logger.error(err.stack || error)
        return res.status(400).json({ error: error })
    }
}

const getWalletHistoryPoints = async (req, res) => {
    var Url = req.protocol + '://' + req.get('host') + req.originalUrl;
    let page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);
    const mid = req.params.merchantId;
    try {
        const Total_Orders = await MerchantService.getallWalletOrders(mid);
        const HistoryPoints = await MerchantService.getWalletHistoryPoints({ Total_Orders, mid, page, limit });
        if (HistoryPoints) {

            const response = {
                code: 2001,
                total_orders: Total_Orders.length,
                message: 'SUCCESS',
                status: 'SUCCESS',
                summary: HistoryPoints
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
            code: 400,
            messsage: err.message,
        }

        logger.error(err.stack || error)
        return res.status(400).json({ error: error })

    }
}

module.exports = { settlement, getTransactionSummary, getHistoryPoints, getWalletHistoryPoints }