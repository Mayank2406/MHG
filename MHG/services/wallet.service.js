const UserQuery = require('../query/userMaster.query')

const getMerchantWallets = async(mid) => {
     // check if merchant exists or not in merchant collection:
     const Merchant = await UserQuery.findMerchant(mid);
     if (!Merchant) {
         throw ({ code: 404, message: 'Merchant does not exists', status: 'Fail' });
     }
    
    const Wallets =  await UserQuery.findallMerchant(mid);
    return Wallets;
}

const creditBudget = async ({mid,points,walletId}) => {
    const wallet_type = 'BUDGET';
    const Wallet = await UserQuery.findOneSpecialMerchant(mid,wallet_type);
    const updated_balance = Wallet.price_point_value + points;
    UserQuery.findMerchantandUpdate({ mid, updated_balance, wallet_type});
    const UpdatedWallet = await UserQuery.findOneSpecialMerchant(mid,wallet_type);
    return UpdatedWallet;
}

module.exports = {getMerchantWallets,creditBudget}