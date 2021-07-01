// For updating balance in UserMaster collection:
const UserMaster = require('../models/userMaster');

const UserService = require('../services/userMaster')


// For mer_id validation:
const Merchants = require('../models/merchant');


// for updating in user_history :
const UserHistory = require('../models/userHistory');


// for updating revenue in wallet collection:
const Wallet = require('../models/wallet');


// userMaster_get:

const master_get = async (req,res) => {
    try
    {
        const users = await UserService.getUsers();
        if(users)
            return res.status(200).json({ status:200,message:'All users are fetched', data: users });
        else    
            return res.status(404).json({ status:404,message:"Can't Fetch Users"})
    }
    catch(e)
    {
        return res.status(400).json({ status:400,message:e.message})
    }
}

// balance_get:

const balance_get = async(req, res) => {
    const mid = req.ex;                 // The mid is returned from merchant_auth and gets stored here.
    const userId = req.params.userId

    // Step1 : Authenticate the merchant_id:
    // Step2 : Check if the userId is present in the db.
    // Step3 : If (present) -----> return the balance.
    // Step4 : If (absent)  -----> Make a new account with given userId and balance 0.
    try
    {
        const userBalance = await UserService.getuserBalance(userId, mid);
        return res.status(200)
                  .json({
                        code: 2001,
                        messsage: 'success',
                        status: 'SUCCESS',
                        balance: userBalance
                        })
    }
    catch
    {
        return res.status(404)
                  .json({
                    code: 404,
                    messsage: 'Fail',
                    status: 'Fail',
                        })
    }
}

const debit = async (req, res) => {
    const UserId = req.params.userId;
    const mid = req.ex;    
    const query = req.body;

    try
    {
        const result = await UserService.getDebit({UserId,mid,query});
        if(result)
            {
                return res.status(200)
                .json({
                    code:2001,
                    message:'SUCCESS',
                    status:'SUCCESS'
                })
            }
            else
            {
                return res.status(400)
                .json({
                    message:'Some error occurred'
                })
            }
    }
    catch(err)
    {
        return res.status(404)
                  .json({
                    code: 404,
                    messsage: 'Fail',
                    status: 'Fail',
                        })
    }
};


// Credit Api:

const credit = (req, res) => {
     // check if order id is present or not:
     checkOrderId(req.body.order_id, function (result) {
        if (result)
            return res.status(202).json({ message: 'Order id already present' });
        else {
            const mid = req.ex;
            const userId = req.params.userId;
            const deduct = req.body.points;

            Wallet.findOne({ mid: mid})
                .then(data => {
                    if (data)  // Merchant found -> update balance after deduction -> save
                    {
                        const new_balance = data.price_point_value - deduct;

                        if (deduct > data.price_point_value) {
                            res.status(203).send("insufficient balance")
                        }
                        else {
                            // 1) deduct the merchant balance.
                            // 2) insert payload into user_history.
                            // 3) increment the user (in User_Master collection) balance


                            // step:1
                            Wallet.updateOne({ mid: mid }, { $set: { price_point_value: new_balance } })
                                .then(result => res.status(200).json({ message: "Balance updated" }))
                                .catch(err => console.log(err))

                            var updated_balance;
                            // step:3
                             UserMaster.findOne({ user_id: userId })
                                .then(data => {
                                    // console.log(data.price_point_value);

                                    updated_balance = data.price_point_value + deduct;
                                    // console.log(updated_balance);
                                    UserMaster.updateOne({user_id: userId },
                                        { $set: { price_point_value: updated_balance } })
                                        .then()
                                        .catch(err => console.log(err))
                                }).then(data =>
                                     {
                                          // step:2
                                        const game = new UserHistory(
                                            {
                                                description: req.body.description,
                                                transaction_type: req.body.transaction_type,
                                                source: req.body.source,
                                                user_id: userId,
                                                merchant_id: mid,
                                                order_id: req.body.order_id,
                                                price_point_value: req.body.points,
                                                last_updated_playpoint: updated_balance,
                                                user_action: req.body.user_action
                                            })
                                        game.save();
                                     })
                                .catch(err => {
                                    console.log(err);
                                })
                        
                             // step:2
                            //  const game = new UserHistory(
                            //     {
                            //         description: req.body.description,
                            //         transaction_type: req.body.transaction_type,
                            //         source: req.body.source,
                            //         user_id: userId,
                            //         merchant_id: mid,
                            //         order_id: req.body.order_id,
                            //         price_point_value: req.body.points,
                            //         last_updated_playpoint: updated_balance,
                            //         user_action: req.body.user_action
                            //     })
                            // game.save();
                        }
                    }
                    else {
                        res.status(203).json({ messsage: 'user not found' });
                    }
                })
                .catch(err => res.status(404).json({ messsage: err.message || err.toString() }))
        }
    });
 }




module.exports = { master_get, balance_get, debit, credit };