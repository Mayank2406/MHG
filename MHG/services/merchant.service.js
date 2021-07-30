const UserQuery = require('../query/userMaster.query')

const settleWallet = async ({ wallet_type, query, mid }) => {
    const Escrow = await UserQuery.findOneSpecialMerchant(mid, 'ESCROW');
    const Revenue = await UserQuery.findOneSpecialMerchant(mid, 'REVENUE');
    const Budget  = await UserQuery.findOneSpecialMerchant(mid, 'BUDGET');
    const Wallet =  wallet_type.toUpperCase();
    const deduct = parseInt(query.points); 
    
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


const getcoinsSummary = async (mid) => {
    const coinsSummary = await UserQuery.findCoinsSummary(mid);
    const Transaction  = await UserQuery.firstandlastTransaction(mid);

    var pointsfromUser = 0, pointstoUser = 0;
    var openingBalance = Transaction[0].price;
    var closingBalance = Transaction[Transaction.length-1].price;

    for (let i = 0; i < coinsSummary.length; i++) {
        const Type = coinsSummary[i]._id.Type;
        const result = coinsSummary[i].result;

        if (Type === 'debit') {
           pointsfromUser += result;
        }
        else {
           pointstoUser += result;
        }
    }
    var result = {pointsfromUser,pointstoUser,openingBalance,closingBalance};
    return result;
}

const getallOrders = async (mid) => {
    const orders = await UserQuery.getallOrders(mid);
    return orders;
}

const getHistoryPoints = async ({Total_Orders,mid,page,limit}) => {
    if(!page)  page = 1;       // Default page value:
    if(!limit || limit>10) limit = 10;     // Default limit value:

    let no_of_pages = Math.ceil(Total_Orders.length /limit)
    if(page>no_of_pages)    page = no_of_pages;
    
    const startIndex =  (page-1) * limit;
    const result = {};

    try{
        result.maxResults = limit;
        result.results = await UserQuery.findMerchantOrders({mid,limit,startIndex});
        return result;
    }
    catch{
        throw ({ code: 404, message: 'Orders not found', status: 'Fail' }); 
    }
}

const getallWalletOrders = async (mid)=> {
    const orders = await UserQuery.getallWalletOrders(mid);
    return orders;
}

const getWalletHistoryPoints = async ({Total_Orders,mid,page,limit})=> {
    if(!page)  page = 1;       // Default page value:
    if(!limit || limit>10) limit = 10;     // Default limit value:

    let no_of_pages = Math.ceil(Total_Orders.length /limit)
    if(page>no_of_pages)    page = no_of_pages;
    
    const startIndex =  (page-1) * limit;
    const result = {};

    try{
        result.maxResults = limit;
        result.results = await UserQuery.findWalletMerchantOrders({mid,limit,startIndex});
        return result;
    }
    catch{
        throw ({ code: 404, message: 'Orders not found', status: 'Fail' }); 
    }
}

module.exports = { settleWallet,getcoinsSummary,getallOrders,getHistoryPoints,getallWalletOrders,getWalletHistoryPoints}