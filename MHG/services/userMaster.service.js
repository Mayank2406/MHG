const UserQuery = require('../query/userMaster.query')

const getUsers = async () => {
    const users = await UserQuery.findUser();
    return users;
}

const getUserRank = async(userId) => {
    const users = await UserQuery.findUser();
    // users contains list of all users sorted by price_point_value in decreasing order:
    
    const ranks = [];
    for(let i = 0; i < users.length; i++) 
    {
        if(i<10)
        {
            ranks.push({
                user_id : users[i].user_id,
                points  : users[i].price_point_value,
                rank    : i+1
            })   
        }
        if(users[i].user_id===userId && i>10)
        {   
            ranks.push({
                user_id : users[i].user_id,
                points  : users[i].price_point_value,
                rank    : i+1
            })   
        }
    }
    
    return ranks;
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
                
            const wallet_type = 'BUDGET';
            const special_merchant = await UserQuery.findOneSpecialMerchant(mid,wallet_type);
            const wallet_id = special_merchant._id;
            
            const newMerchantTransaction = await UserQuery.updateMerchantHistory({UserId, mid,wallet_id,updated_balance,query});

            UserQuery.findMerchantandUpdate({ mid, updated_balance,wallet_type});

            const new_balance = user.price_point_value + deduct;
            UserQuery.findUserandUpdate({ UserId, new_balance });

            const newUserTransaction = await UserQuery.updateUserHistory({ UserId, mid, new_balance, query })

            return user;
        }
        else
            throw ({ code: 404, message: 'Insufficient balance', status: 'Fail' });
    }
    else
        throw ({ code: 404, message: 'User not found', status: 'Fail' });
}

const getOrders = async(userId)=> {
    const orders = await UserQuery.findOrders(userId);
    return orders;
}

const getTotalOrders = async(userId)=> {
    const orders = await UserQuery.findTotalOrders(userId);
    return orders;
}

module.exports = { getUsers, getUserRank,getuserBalance, getDebit, getCredit,getOrders,getTotalOrders}