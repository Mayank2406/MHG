const WalletService = require('../services/wallet.service');


const merchant_get = async (req, res) => {
    const mid = req.ex;
    try {
        const Wallets = await WalletService.getMerchantWallets(mid);
        if (Wallets) {
            return res.status(200)
                .json({
                    code: 2001,
                    message: 'SUCCESS',
                    status: 'SUCCESS',
                    wallets: Wallets
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

const creditBudget = async (req, res) => {
    const mid = req.ex;
    const walletId = req.params.walletId;
    const points   = req.body.points;

    try {
        const Wallet = await WalletService.creditBudget({mid,points,walletId});
        if (Wallet) {
            return res.status(200)
                .json({
                    code: 2001,
                    message: 'SUCCESS',
                    status: 'SUCCESS',
                    wallets: Wallet
                })
        }
        else {
            return res.status(400)
                .json({
                    message: 'Some error occurred'
                })
        }
    }
    catch (e) {
        return res.status(400).json({ status: 400, message: e.message })   
    }
}

module.exports = { merchant_get, creditBudget }