const MerchantService = require('../services/merchant.service');


const settlement = async (req, res) => {
    const wallet_type = req.params.wallet_type;
    const query = req.body;
    const mid = req.params.merchantId;
    try {
        const settlement = await MerchantService.settleWallet({ wallet_type, query, mid });
        if (settlement) {
            return res.status(200)
                .json({
                    code: 2001,
                    message: 'SUCCESS',
                    status: 'SUCCESS',
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
}

const getTransactionSummary = async (req, res) => {
    const mid = req.params.merchantId;
    try {
        const Summary = await MerchantService.getcoinsSummary(mid);
        if (Summary) {
            return res.status(200)
                .json({
                    code: 2001,
                    message: 'SUCCESS',
                    status: 'SUCCESS',
                    summary: Summary
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
}

const getHistoryPoints = async (req, res) => {
    let page   = parseInt(req.query.page); 
    let limit  = parseInt(req.query.limit);
    const mid =  req.params.merchantId;
    try {
        const Total_Orders = await MerchantService.getallOrders(mid);
        const HistoryPoints = await MerchantService.getHistoryPoints({Total_Orders,mid,page,limit});
        if (HistoryPoints) {
            return res.status(200)
                .json({
                    code: 2001,
                    total_orders:Total_Orders.length,
                    message: 'SUCCESS',
                    status: 'SUCCESS',
                    summary: HistoryPoints
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
        return res.status(400)
            .json({
                code: 400,
                messsage: err.message,
            })
    }
}

const getWalletHistoryPoints = async (req, res) => {
    let page   = parseInt(req.query.page); 
    let limit  = parseInt(req.query.limit);
    const mid = req.params.merchantId;
    try {
        const Total_Orders = await MerchantService.getallWalletOrders(mid);
        const HistoryPoints = await MerchantService.getWalletHistoryPoints({Total_Orders,mid,page,limit});
        if (HistoryPoints) {
            return res.status(200)
                .json({
                    code: 2001,
                    total_orders:Total_Orders.length,
                    message: 'SUCCESS',
                    status: 'SUCCESS',
                    summary: HistoryPoints
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
        return res.status(400)
            .json({
                code: 400,
                messsage: err.message,
            })
    }
}

module.exports = { settlement, getTransactionSummary, getHistoryPoints, getWalletHistoryPoints}