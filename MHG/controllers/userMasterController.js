const UserMaster = require('../models/userMaster');

// For mer_id validation:
const Merchants = require('../models/merchant');


// for updating in user_history :
const UserHistory = require('../models/userHistory');


// for updating revenue in wallet collection:
const Wallet = require('../models/wallet');
 

// userMaster_get:

const master_get = ((req, res) => {
    UserMaster.find()
        .then(result => {
            res.status(200).json({ message: 'All users are finally fetched', result: result })
        })
        .catch(err => res.status(404).json({ message: err }))
});


// balance_get:

const balance_get = (req, res) =>{
    
    // The mid is returned from merchant_auth and gets stored here.
    const mid = req.ex;
    // console.log(req.headers.merchant_id);
    const userId = req.params.userId
    console.log(userId);
    // Step1 : Authenticate the merchant_id:
    // Step2 : Check if the userId is present in the db.
    // Step3 : If (present) -----> return the balance.
    // Step4 : If (absent)  -----> Make a new account with given userId and balance 0.

    // step:1  Done in middleware:

    // step: 2,3,4

    UserMaster.findOne({user_id: userId})  
    .then (user => {
            if(user)
                res.status(200).json
                        ({
                            code:2001,
                            messsage:'success',
                            status:'SUCCESS',
                            balance: user.price_point_value
                        })
            else
                {
                    const user =  new UserMaster({
                        user_id:userId,
                        merchant_id:mid,
                        price_point_value:0
                    })
                    user.save()
                    .then(user =>{
                        res.status(200).json
                        ({
                            code:2001,
                            messsage:'success',
                            status:'SUCCESS',
                            balance: user.price_point_value
                        })
                    })
                    .catch(err => {res.status(404).json({err:err.message})})
                }
        })
    .catch(err => res.status(404).json({ messsage: err.message || err.toString()}))
    }

const debit = (req, res) => {
    
    const mid = req.ex;
    const userId  = req.params.userId;
    const deduct = req.body.points;
    
    UserMaster.findOne({user_id:userId})
    .then(data =>
        {
            if(data)  // user found -> update balance after deduction -> save
            {
                const new_balance = data.price_point_value-deduct;

                if(deduct>data.price_point_value)
                {
                    res.status(203).send("insufficient balance")
                }
                else
                {
                    // 1) deduct the user balance.
                    // 2) insert payload into user_history.
                    // 3) increment the merchant revenue(in wallet collection) balance


                    // step:1
                    UserMaster.updateOne({user_id:userId}, {$set:{price_point_value:new_balance}})
                    .then( result => res.status(200).json({message:"Balance updated"}) )
                    .catch(err => console.log(err))

                    // step:2
                    const game = new UserHistory(
                        {
                            description:req.body.description,
                            transaction_type:req.body.transaction_type,
                            source:req.body.source,
                            user_id:userId,
                            merchant_id:mid,
                            order_id:req.body.order_id,
                            price_point_value:req.body.points,
                            last_updated_playpoint:new_balance,
                            user_action:req.body.user_action  
                        })
                    game.save()

                    // step:3
                    Wallet.findOne({mid:mid})
                    .then(data=>{
                        console.log(data.price_point_value);
                        
                        const updated_balance = data.price_point_value+deduct;
                        console.log(updated_balance);
                        Wallet.updateOne({mid:mid},
                                         {$set:{price_point_value:updated_balance}})
                        .then(data=>console.log(data.price_point_value))
                        .catch(err=>console.log(err))
                    })
                    .catch(err=>{
                        console.log(err);
                    })        

                } 
            }
            else
            {
                res.status(203).json({ messsage:'user not found'});
            }
        }) 
    .catch(err => res.status(404).json({ messsage: err.message || err.toString()}))
};

module.exports = { master_get,balance_get,debit};