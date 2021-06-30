const UserMaster = require('../models/userMaster');

const findUser = () =>{
    try
    {
        return UserMaster.find()
    }
    catch(e)
    {
        return null;
    }
}

const findOneUser = (userId) => {
    const User =  UserMaster.findOne({ user_id: userId })
    
    if(User)
        return User;
    else
        return null;
}

// New User For Balance
const newUser = (query)=>{
    const user = new UserMaster({
        user_id: query.userId,
        merchant_id: query.mid,
        price_point_value: 0
    })
    user.save();
    return user;
}


module.exports = {findUser,findOneUser,newUser}