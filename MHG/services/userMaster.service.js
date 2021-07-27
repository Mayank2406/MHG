const UserQuery = require('../query/userMaster.query')

const getUsers = async () => {
    const users = await UserQuery.findUser();
    return users;
}

const getUserRank = async (mid, userId) => {

    // check if merchant exists or not in merchant collection:
    const Merchant = await UserQuery.findMerchant(mid);
    if (!Merchant) {
        throw ({ code: 404, message: 'Merchant does not exists', status: 'Fail' });
    }

    const user = await UserQuery.findOneUser(userId)
    const merchant_id = user.merchant_id;
    if(!user || (merchant_id!==mid)){
        throw ({ code: 404, message: 'User does not exists', status: 'Fail' });
    }

    const merchant = await UserQuery.findOneMerchantfromUserMaster(mid);
    if(!merchant){
        throw ({ code: 404, message: 'Merchant does not exists', status: 'Fail' });
    }

    const users = await UserQuery.findUser(mid);
    // users contains list of all users sorted by price_point_value in decreasing order:

    const ranks = [];
    for (let i = 0; i < users.length; i++) {
        if (i < 10) {
            ranks.push({
                user_id: users[i].user_id,
                points: users[i].price_point_value,
                rank: i + 1
            })
        }
        if (users[i].user_id === userId && i > 10) {
            ranks.push({
                user_id: users[i].user_id,
                points: users[i].price_point_value,
                rank: i + 1
            })
        }
    }

    return ranks;
}

const getuserBalance = async (userId, mid) => {

    const merchant = await UserQuery.findMerchant(mid);
    if (!merchant) {
        throw ({ code: 404, message: 'Merchant does not exists', status: 'Fail' });
    }

    const userBalance = await UserQuery.findOneUser(userId);
    const Merchant = await UserQuery.findOneMerchantfromUserMaster(mid);
    if (userBalance && Merchant) {
        return userBalance.price_point_value;
    }
    else {
        const query = { userId, mid };
        const newUser = await UserQuery.newUser(query);
        return newUser.price_point_value;
    }
}

const getcoinsSummary = async (mid) => {
    const coinsSummary = await UserQuery.findCoinsSummary(mid);

    var pointsInfromApp = 0, pointsInfromGame = 0, pointsInfromUser = 0;
    var pointsOutFromApp = 0, pointsOutFromGame = 0;

    for (let i = 0; i < coinsSummary.length; i++) {
        const Type = coinsSummary[i]._id.Type;
        const src = coinsSummary[i]._id.src;
        const result = coinsSummary[i].result;

        if (Type === 'debit') {
            if (src === 'app')
                pointsInfromApp += result;
            else
                pointsInfromGame += result;
        }
        else {
            if (src === 'app')
                pointsOutFromApp += result;
            else
                pointsOutFromGame += result;
        }
    }
    pointsInfromUser = pointsInfromGame + pointsInfromApp;
    var result = { pointsInfromApp, pointsInfromGame, pointsOutFromApp, pointsOutFromGame, pointsInfromUser };
    return result;
}

const getDebit = async ({ UserId, mid, query }) => {

    // check if merchant exists or not in merchant collection:
    const Merchant = await UserQuery.findMerchant(mid);
    if (!Merchant) {
        throw ({ code: 404, message: 'Merchant does not exists', status: 'Fail' });
    }

    // check if user exist in userMaster.
    // check if merchant exist in wallet.
    // check if order_id is unique.

    const user = await UserQuery.findOneUser(UserId)
    const merchant = await UserQuery.findOneMerchant(mid);
    const order = await UserQuery.findOneOrder(query.order_id);
    const deduct = parseInt(query.points);
    const user_action = query.user_action.toLowerCase();

    if (order) {
        throw ({ code: 404, message: 'Order Id already exists', status: 'Fail' });
    }

    // Valid Condition:
    if (user && merchant) {
        if (deduct <= user.price_point_value) {
            const new_balance = user.price_point_value - deduct;
            UserQuery.findUserandUpdate({ UserId, new_balance });

            const newUserTransaction = await UserQuery.updateUserHistory({ UserId, mid, new_balance, query })

            var wallet_type;

            if (user_action === 'win')
                wallet_type = 'REVENUE';
            else
                wallet_type = 'ESCROW';

            const special_merchant = await UserQuery.findOneSpecialMerchant(mid, wallet_type);
            const wallet_id = special_merchant._id;
            const updated_balance = special_merchant.price_point_value + deduct;

            UserQuery.findMerchantandUpdate({ mid, updated_balance, wallet_type });

            const newMerchantTransaction = UserQuery.updateMerchantHistory({ UserId, mid, wallet_id, updated_balance, query });

            return user;
        }
        else
            throw ({ code: 404, message: 'Insufficient balance', status: 'Fail' });
    }
    else
        throw ({ code: 404, message: 'User not found', status: 'Fail' });
}


const getCredit = async ({ UserId, mid, query }) => {

    // check if merchant exists or not in merchant collection:
    const Merchant = await UserQuery.findMerchant(mid);
    if (!Merchant) {
        throw ({ code: 404, message: 'Merchant does not exists', status: 'Fail' });
    }

    const user = await UserQuery.findOneUser(UserId)
    const merchant = await UserQuery.findOneMerchant(mid);
    const order = await UserQuery.findOneOrder(query.order_id);
    const deduct = parseInt(query.points);

    if (typeof (deduct) != 'number') {
        throw ({ code: 404, message: 'Points to deduct is not a number', status: 'Fail' });
    }

    if (order) {
        throw ({ code: 404, message: 'Order Id already exists', status: 'Fail' });
    }

    // Valid Condition:

    if (user && merchant) {
        // Merchant found -> update balance after deduction -> save

        if (deduct <= merchant.price_point_value) {
            const updated_balance = merchant.price_point_value - deduct;

            const wallet_type = 'BUDGET';
            const special_merchant = await UserQuery.findOneSpecialMerchant(mid, wallet_type);
            const wallet_id = special_merchant._id;

            const newMerchantTransaction = await UserQuery.updateMerchantHistory({ UserId, mid, wallet_id, updated_balance, query });

            UserQuery.findMerchantandUpdate({ mid, updated_balance, wallet_type });

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

const getOrders = async ({ total_orders, userId, page, limit }) => {

    if (!page) page = 1;       // Default page value:
    if (!limit || limit > 10) limit = 10;     // Default limit value:

    let no_of_pages = Math.ceil(total_orders.length / limit)
    if (page > no_of_pages) page = no_of_pages;

    const startIndex = (page - 1) * limit;
    const result = {};

    try {
        result.maxResults = limit;
        result.results = await UserQuery.findOrders({ userId, limit, startIndex });
        return result;
    }
    catch (err) {
        throw ({ code: 404, message: 'Orders not found', status: 'Fail' });
    }
}

const getTotalOrders = async (userId) => {
    const orders = await UserQuery.findTotalOrders(userId);
    return orders;
}

const checkOrder = async (orderId) => {
    const order = await UserQuery.findOneOrder(orderId);
    return order;
}

module.exports = {
    getUsers, getUserRank, getuserBalance, getDebit, getCredit, getOrders, getTotalOrders,
    getcoinsSummary, checkOrder
}