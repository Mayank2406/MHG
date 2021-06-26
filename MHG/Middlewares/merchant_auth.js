const checkLogin = (req, res, next) => {
    const source = req.body.source;
    if(source!=='Game')
        res.json({error:"invalid Game"})
    else
        next();
}

module.exports = checkLogin;
