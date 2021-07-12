const WalletService = require('../services/wallet.service');


const merchant_get = async (req, res) => {
    const mid = req.ex;
    console.log(mid);
    try {
        const Wallets = await WalletService.getMerchantWallets(mid);
        if (Wallets) {
            return res.status(200)
                .json({
                    code: 2001,
                    message: 'SUCCESS',
                    status: 'SUCCESS',
                    wallets:Wallets
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
module.exports = { merchant_get }