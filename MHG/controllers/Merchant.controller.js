const MerchantService = require('../services/merchant.service');


const settlement = async (req, res) => {
    const wallet_type = req.params.wallet_type;
    const query = req.body;
    const mid = req.ex;
    try {
        const settlement = await MerchantService.settleWallet({ wallet_type,query,mid });
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

module.exports = { settlement}