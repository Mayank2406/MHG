const UserQuery = require('../query/userMaster.query')

const getMerchantWallets = async(mid) => {
    const Wallets =  await UserQuery.findallMerchant(mid);
    return Wallets;
}

module.exports = {getMerchantWallets}