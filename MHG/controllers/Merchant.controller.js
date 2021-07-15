const MerchantService = require('../services/merchant.service');


const settleEscrow = async (req, res) => {
    const query = req.body;
    const mid = req.ex;
    try {
        const settleEscrow = await MerchantService.settleEscrow({ query, mid });
        if (settleEscrow) {
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

const settleRevenue = async (req, res) => {
    const query = req.body;
    const mid = req.ex;
    try {
        const settleRevenue = await MerchantService.settleRevenue({ query, mid });
        if (settleRevenue) {
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

module.exports = { settleEscrow, settleRevenue }