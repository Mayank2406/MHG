const UserMaster = require('../models/userMaster');
const Wallet = require('../models/wallet');
const UserHistory = require('../models/userHistory');

const findUser = () => {
    try {
        return UserMaster.find()
    }
    catch (e) {
        return null;
    }
}

const findOneUser = (userId) => {
    const User = UserMaster.findOne({ user_id: userId })
    return User;
}

const findOneMerchant = (mid) => {
    const Merchant = Wallet.findOne({ mid: mid })
    return Merchant;
}

const findOneOrder = (orderId) => {
    const Order = UserHistory.findOne({ order_id: orderId })
    return Order;
}

const findUserandUpdate = ({ UserId, new_balance }) => {
    UserMaster.updateOne({ user_id: UserId }, { $set: { price_point_value: new_balance } })
        .then()
        .catch(err => console.log('cant update user'))
}

const findMerchantandUpdate = ({ mid, updated_balance }) => {
    Wallet.updateOne({ mid: mid },
        { $set: { price_point_value: updated_balance } })
        .then()
        .catch(err => console.log('cant update merchant'))
}

// New User For Balance
const newUser = (query) => {
    const user = new UserMaster({
        user_id: query.userId,
        merchant_id: query.mid,
        price_point_value: 0
    })
    user.save();
    return user;
}

// New Transaction in UserHistory
const updateUserHistory = ({ UserId, mid, new_balance, query }) => {
    const game = new UserHistory(
        {
            description: query.description,
            transaction_type: query.transaction_type,
            source: query.source,
            user_id: UserId,
            merchant_id: mid,
            order_id: query.order_id,
            price_point_value: query.points,
            last_updated_playpoint: new_balance,
            user_action: query.user_action
        })
    game.save()
    return game;
}

module.exports = {
    findUser, findOneUser, findOneMerchant,
    findOneOrder, findUserandUpdate, newUser,
    findMerchantandUpdate, updateUserHistory
}