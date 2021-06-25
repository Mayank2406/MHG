const UserMaster = require('../models/userMaster');

// For mer_id validation:
const Merchants = require('../models/merchant');


// for updating in user_history :
const userHistory = require('../models/userHistory');
const UserHistory = require('../models/userHistory');
 

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
    
    // console.log(req.headers.merchant_id);
    const userId = req.params.userId
    console.log(userId);
    // Step1 : Authenticate the merchant_id:
    // Step2 : Check if the userId is present in the db.
    // Step3 : If (present) -----> return the balance.
    // Step4 : If (absent)  -----> Make a new account with given userId and balance 0.

    // step:1 


    const mer_id = req.headers.merchant_id;         //encoded
    const decodedData = Buffer.from(mer_id, 'base64').toString('ascii') // decoded


    // decodedData is something like this: Basic 604f00e19d5b6e44a30cca77:604f00e19d5b6e44a30cca77
    // extacting mid and mid_secret from it.

    let mid = "", mid_secret = "";
    let i;
    for (i = 6; i < decodedData.length; i++) {
        if (decodedData[i] == ':')
            break;
        mid += decodedData[i];
    }

    for (let j = i + 1; j < decodedData.length; j++) {
        mid_secret += decodedData[j];
    }

    // console.log(decodedData);

     // check if mer_id constains Basic or not:
     const basic = decodedData.includes('Basic');

     // if mid is not provided.
     if (!mer_id) return res.status(404).send('No Token');

     


     // search in database if mid exist or not 
    // if it exists then execute step(2,3,4)


    Merchants.find({ mid: mid, mid_secret: mid_secret }, (err, result) => {
        if (err) res.status(400).json({ message: 'No such Merchant' });
        else if (!result.length || basic === false) res.status(403).json({ messsage: 'No such Merchant' })
        else
            {

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
    })
};


const debit = (req, res) => {
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
                    UserMaster.updateOne({user_id:userId}, {$set:{price_point_value:new_balance}})
                    .then( result => res.status(200).json({message:"Balance updated"}) )
                    .catch(err => console.log(err))

                    const game = new UserHistory(
                        {
                            description:req.body.description,
                            transaction_type:req.body.transaction_type,
                            source:req.body.source,
                            user_id:userId,
                            merchant_id:'102',
                            order_id:req.body.order_id,
                            price_point_value:req.body.points,
                            last_updated_playpoint:new_balance,
                            user_action:req.body.user_action  
                        })
                    game.save()
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