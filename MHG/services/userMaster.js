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


module.exports = { getUsers, getuserBalance }