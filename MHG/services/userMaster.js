const UserQuery = require('../query/userMaster')

const getUsers = async () => {
    const users = await UserQuery.findUser();
    return users;
}

const getuserBalance = async (userId, mid) => {
    const userBalance = await UserQuery.findOneUser(userId);
    if (userBalance) {
        return userBalance.price_point_value;
    }
    else {
        const query = { userId, mid };
        const newUser = await UserQuery.newUser(query);
        return newUser.price_point_value;
    }
}

const getDebit = async ({ UserId, mid, query }) => {
    // check if user exist in userMaster.
    // check if merchant exist in wallet.
    // check if order_id is unique.

    const user = await UserQuery.findOneUser(UserId)
    const merchant = await UserQuery.findOneMerchant(mid);
    const order = await UserQuery.findOneOrder(query.order_id);
    const deduct = query.points;
    const user_action =  query.user_action.toLowerCase();
    
    if (order) {
        throw ({ code: 404, message: 'Order Id already exists', status: 'Fail' });
    }

    // Valid Condition:
    if (user && merchant && !order) {
        if (deduct <= user.price_point_value) {
            const new_balance = user.price_point_value - deduct;
            UserQuery.findUserandUpdate({ UserId, new_balance });

            const newUserTransaction = await UserQuery.updateUserHistory({ UserId, mid, new_balance, query })

            var wallet_type;

            if(user_action==='win')
                wallet_type = 'REVENUE';
            else    
                wallet_type = 'ESCROW';

            const special_merchant = await UserQuery.findOneSpecialMerchant(mid,wallet_type);
            const wallet_id =  special_merchant._id;
            const updated_balance =  special_merchant.price_point_value + deduct;

            UserQuery.findMerchantandUpdate({ mid, updated_balance,wallet_type});
    
            const newMerchantTransaction = UserQuery.updateMerchantHistory({UserId, mid,wallet_id,updated_balance,query});

            return user;
        }
        else
            throw ({ code: 404, message: 'Insufficient balance', status: 'Fail' });
    }
    else
        throw ({ code: 404, message: 'User not found', status: 'Fail' });
}


const getCredit = async ({ UserId, mid, query }) => {
    const user = await UserQuery.findOneUser(UserId)
    const merchant = await UserQuery.findOneMerchant(mid);
    const order = await UserQuery.findOneOrder(query.order_id);
    const deduct = query.points;

    if (order) {
        throw ({ code: 404, message: 'Order Id already exists', status: 'Fail' });
    }

    // Valid Condition:

    if (user && merchant && !order) {
        // Merchant found -> update balance after deduction -> save

        if (deduct <= merchant.price_point_value) {
            const updated_balance = merchant.price_point_value - deduct;

            const newMerchantTransaction = await UserQuery.updateMerchantHistory({UserId, mid,wallet_id,updated_balance,query});

            const wallet_type = 'BUDGET';
            const special_merchant = await UserQuery.findOneSpecialMerchant(mid,wallet_type);
            const wallet_id = special_merchant._id;


            UserQuery.findMerchantandUpdate({ mid, updated_balance,wallet_type});

            const new_balance = user.price_point_value + deduct;
            await UserQuery.findUserandUpdate({ UserId, new_balance });

            const newUserTransaction = await UserQuery.updateUserHistory({ UserId, mid, new_balance, query })

            return user;
        }
        else
            throw ({ code: 404, message: 'Insufficient balance', status: 'Fail' });
    }
    else
        throw ({ code: 404, message: 'User not found', status: 'Fail' });
}

module.exports = { getUsers, getuserBalance, getDebit, getCredit }