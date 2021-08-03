const WalletService = require('../services/wallet.service');
const { logger } = require("../logger");

const merchant_get = async (req, res) => {
    var Url = req.protocol + '://' + req.get('host') + req.originalUrl;
    const mid = req.params.merchantId;
    try {
        const Wallets = await WalletService.getMerchantWallets(mid);
        if (Wallets) {

            const response = {
                code: 2001,
                message: 'SUCCESS',
                status: 'SUCCESS',
                wallets: Wallets
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
        return res.status(err.code).json({ error: error })
    }
}

const creditBudget = async (req, res) => {
    var Url = req.protocol + '://' + req.get('host') + req.originalUrl;
    const mid = req.params.merchantId;
    const points = req.body.points;

    try {
        const Wallet = await WalletService.creditBudget({ mid, points });
        if (Wallet) {

            const response =
            {
                code: 2001,
                message: 'SUCCESS',
                status: 'SUCCESS',
                wallets: Wallet
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
        const error = { status: 400, message: err.message }
        logger.error(err.stack || error)
        return res.status(400).json({ error: error })
    }
}

module.exports = { merchant_get, creditBudget }