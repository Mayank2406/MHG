const Merchants = require('../models/merchant.model');
const UserMaster = require('../models/userMaster.model');

const merchantLogin = (req, res, next) => {
    const mer_id = req.headers.merchant_id;     
    if (!mer_id) return res.status(404).send('No Token Provided');

    const decodedData = Buffer.from(mer_id, 'base64').toString('ascii')
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
    const basic = decodedData.includes('Basic');
    req.ex = mid;

    // console.log(mid);

    Merchants.find({ mid: mid, mid_secret: mid_secret }, (err, result) => {
        if (err) res.status(400).json({ message: 'No such Merchant' });
        else if (!result.length || basic === false) res.status(403).json({ messsage: 'No such Merchant' })
        else    next();
    })
}

const userPresent = (req,res,next) =>{
    const userId = req.params.userId;
    UserMaster.find({ user_id: userId },(err, result) =>{
        if(err) res.status(400).json({ messsage:err.message || err.toString()});
        else if (!result.length) res.status(403).json({ messsage: 'No such User' })
        else    next();
    })
}

module.exports = {merchantLogin,userPresent}
