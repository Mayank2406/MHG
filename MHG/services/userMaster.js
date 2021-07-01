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


    // Valid Condition:
    if (user && merchant && !order) {
        if (deduct <= user.price_point_value) {
            const new_balance = user.price_point_value - deduct;
            UserQuery.findUserandUpdate({ UserId, new_balance });

            const newTransaction = await UserQuery.updateUserHistory({ UserId, mid, new_balance, query })

            const updated_balance = merchant.price_point_value + deduct;
            UserQuery.findMerchantandUpdate({ mid, updated_balance });

            return user;
        }
        return null;
    }
    else
        return null;
}

module.exports = { getUsers, getuserBalance, getDebit }