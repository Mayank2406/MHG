const UserQuery = require('../query/userMaster.query')

const settleWallet = async ({ wallet_type, query, mid }) => {
    const Escrow = await UserQuery.findOneSpecialMerchant(mid, 'ESCROW');
    const Revenue = await UserQuery.findOneSpecialMerchant(mid, 'REVENUE');
    const Budget  = await UserQuery.findOneSpecialMerchant(mid, 'BUDGET');
    const Wallet =  wallet_type.toUpperCase();
    const deduct = query.points;
    
    var add_to_wallet,deduct_from_wallet,addtoWallet;
    if (Wallet === 'ESCROW')
        {
            addtoWallet = 'REVENUE';
            deduct_from_wallet = Escrow; 
            add_to_wallet      = Revenue;
        }
    else
        {
            addtoWallet = 'BUDGET';   
            deduct_from_wallet = Revenue;
            add_to_wallet      = Budget;
        }

    if (Escrow && Revenue) {
        // Transfer amount from ESCROW to REVENUE OR REVENUE to BUDGET depending on wallet_type.
        if (deduct <= deduct_from_wallet.price_point_value) {
  
            // 1. update deduct_from_wallet :
            var updated_balance = deduct_from_wallet.price_point_value - deduct;
            UserQuery.findMerchantandUpdate({ mid, updated_balance, wallet_type:Wallet});

            var wallet_id = deduct_from_wallet._id;
            UserQuery.updateMerchantHistory({UserId:'',mid,wallet_id,updated_balance,query});
            
            // 2. update add_to_wallet
            updated_balance = add_to_wallet.price_point_value + deduct;
            UserQuery.findMerchantandUpdate({ mid, updated_balance, wallet_type:addtoWallet})

            wallet_id = add_to_wallet._id;
            UserQuery.updateMerchantHistory({UserId:'',mid,wallet_id,updated_balance,query});

            return Escrow;
        }
        else
            throw ({ code: 404, message: 'Insufficient balance', status: 'Fail' });
    }
    else
        throw ({ code: 404, message: 'User not found', status: 'Fail' });
}


module.exports = { settleWallet }