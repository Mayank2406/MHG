const UserMaster = require('../models/userMaster');


// userMaster_get:

const master_get = ((req, res) => {
    UserMaster.find()
        .then(result => {
            res.status(200).json({ message: 'All users are finally fetched', result: result })
        })
        .catch(err => res.status(404).json({ message: err }))
});


// balance_get:

const balance_get = ((req, res) =>{
    
    // console.log(req.headers.merchant_id);
    
    // Step1 : Authenticate the merchant_id:
    // Step2 : Check if the userId is present in the db.
    // Step3 : If (present) -----> return the balance.
    // Step4 : If (absent)  -----> Make a new account with given userId and balance 0.

    const userId  = req.params.userId;
    UserMaster.find()
    .select(user_id).exec()
    .then((result)=> res.status(200).json(
            {
                balance:result.filter(res=>{
                    return{
                        // _id:res._id,
                        name:res.name
                    }
                })
            }
        )) 
    .catch(()=> res.status(400).json({message:'No users found'}))

});


module.exports = { master_get,balance_get};
