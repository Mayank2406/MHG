const Merchants = require('../models/merchant.model');
const UserMaster = require('../models/userMaster.model');
const Wallet = require('../models/wallet.model');
const UserHistory = require('../models/userHistory.model');
const WalletHistory = require('../models/walletHistory.model');

const findUser = (mid) => {
    try {
        return UserMaster.find({merchant_id:mid}).sort({'price_point_value':-1})
    }
    catch (e) {
        return null;
    }
}

const findTotalOrders = (userId) => {
    return UserHistory.find({user_id: userId}).sort({'createdAt':-1});
}

const findOrders = ({userId,limit,startIndex})=> {
    return UserHistory.find({user_id: userId}).sort({'createdAt':-1}).limit(limit).skip(startIndex);
}

const findOneUser = (userId) => {
    const User = UserMaster.findOne({ user_id: userId })
    return User;
}

const findMerchant = (mid) => {
    const Merchant = Merchants.findOne({mid: mid})
    return Merchant;
}

const findOneMerchantfromUserMaster = (mid)=>{
    const Merchant = UserMaster.findOne({ merchant_id: mid})
    return Merchant;
}

const getallOrders = (mid) => {
    return UserHistory.find({merchant_id: mid});
}

const findMerchantOrders = ({mid,limit,startIndex}) => {
    return UserHistory.find({merchant_id: mid}).sort({'createdAt':-1}).limit(limit).skip(startIndex);
}

const getallWalletOrders = (mid)=>{
    return WalletHistory.find({merchant_id: mid});
}

const findWalletMerchantOrders = ({mid,limit,startIndex}) => {
    return WalletHistory.find({merchant_id: mid}).sort({'createdAt':-1}).limit(limit).skip(startIndex);
}

const findallMerchant = (mid) => {
    const allMerchant = Wallet.find({mid: mid});
    return allMerchant;
}

const findOneMerchant = (mid) => {
    const Merchant = Wallet.findOne({ mid: mid })
    return Merchant;
}

const findOneSpecialMerchant = (mid,wallet_type) => {
    const Merchant = Wallet.findOne({ mid: mid, wallet_type: wallet_type})
    return Merchant;
}

const findOneOrder = (orderId) => {
    const Order = UserHistory.findOne({ order_id: orderId })
    return Order;
}

const findCoinsSummary = (mid) => {
    const agg = [
        {
            '$project': {
                'mid': '$merchant_id',
                'transaction_type': {
                    '$toLower': '$transaction_type'
                },
                'item': {
                    '$toLower': '$source'
                },
                'price': '$price_point_value'
            }
        }, {
            '$match': {
                'item': {
                    '$in': [
                        'game', 'app'
                    ]
                },
                'mid': mid
            }
        }, {
            '$group': {
                '_id': {
                    'Type': '$transaction_type',
                    'src': '$item'
                },
                'result': {
                    '$sum': '$price'
                }
            }
        }
    ];
    const coinsSummary =  WalletHistory.aggregate(agg);
    return coinsSummary;
}

const firstandlastTransaction = (mid) => {
    const agg = [
        {
          '$project': {
            'mid': '$merchant_id', 
            'transaction_type': {
              '$toLower': '$transaction_type'
            }, 
            'item': {
              '$toLower': '$source'
            }, 
            'date': '$createdAt', 
            'price': '$price_point_value'
          }
        }, {
          '$match': {
            'item': {
              '$in': [
                'game', 'app'
              ]
            }, 
            'mid': mid, 
            'transaction_type': 'credit'
          }
        }, {
          '$sort': {
            'date': 1
          }
        }
      ];

      const transaction = WalletHistory.aggregate(agg);
      return transaction;
}


const findUserandUpdate = ({ UserId, new_balance }) => {
    UserMaster.updateOne({ user_id: UserId }, { $set: { price_point_value: new_balance } })
        .then()
        .catch(err => console.log('cant update user'))
}

const findMerchantandUpdate = ({ mid, updated_balance,wallet_type}) => {
    Wallet.updateOne({ mid: mid, wallet_type: wallet_type},
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


// New Transaction in MerchantHistory

const updateMerchantHistory = ({UserId, mid,wallet_id,updated_balance,query}) => {
    const game = new WalletHistory(
        {
            description: query.description,
            transaction_type: query.transaction_type,
            source: query.source,
            user_id: UserId,
            merchant_id: mid,
            order_id: query.order_id,
            wallet_id:wallet_id,
            price_point_value: query.points,
            last_updated_playpoint: updated_balance,
            user_action: query.user_action
        })
    game.save()
    return game;
}


module.exports = {
    findUser, findOneUser, findOneMerchant, findMerchant,
    findOneOrder, findUserandUpdate, newUser,
    findMerchantandUpdate, updateUserHistory,
    findOneSpecialMerchant,updateMerchantHistory,findOrders,findTotalOrders,
    findCoinsSummary,findallMerchant, firstandlastTransaction, findMerchantOrders, getallOrders, 
    getallWalletOrders,findWalletMerchantOrders, findOneMerchantfromUserMaster
}