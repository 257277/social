const jwt = require('jsonwebtoken');
require("dotenv").config();

const authen = (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
        let decoded = jwt.verify(token, process.env.privateKey);
        if (decoded) {
            let userID = decoded.userId;
            req.headers.loggedUserId = userID;
            next();

        }
        else {
            res.status(401).send("please login first!")
        }

    }
    else {
        res.status(401).send("please login first!")
    }
}

module.exports = {
    authen
}