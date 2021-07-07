const Merchants = require('../models/merchant.model');
// blog_get  blog_post


const merchant_get = (req, res) => {
    Merchants.find()
        .then((merchants) => res.status(200).json({
            message: 'All blog posts are fetched',
            headers: req.headers,
            methods: req.method,
            merchants: merchants, // this is array of json objects
            no: merchants.length
        }))
        .catch((err) => res.status(400).json({ message: err }));
}

const merchant_post = (req, res) => {

    const mer_id = req.headers.merchant_id;         //encoded
    const decodedData = Buffer.from(mer_id, 'base64').toString('ascii') // decoded

    // console.log(mer_id);
    console.log(decodedData);

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

    console.log(mid);
    console.log(mid_secret);

    // check if mer_id constains Basic or not:
    const basic = console.log(decodedData.includes('Basic'));

    // if mid is not provided.
    if (!mer_id) return res.status(404).send('No Token');

    // search in database if mid exist or not 
    // if it exists then return name of user else return error.

    Merchants.find({ mid: mid, mid_secret: mid_secret }, (err, result) => {
        if (err) res.status(400).json({ message: 'No such user' });
        else if (!result.length || basic === false) res.status(403).json({ messsage: 'No such user' })
        else res.status(200).json({ messsage: 'User found', result })
    })
}

module.exports = { merchant_get, merchant_post };