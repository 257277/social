const bcrypt = require('bcrypt');

let hashing = (req, res, next) => {
    bcrypt.hash(req.body.password, 5, function (err, hash) {
        if (err) {
            res.status(400).send("something wents wrong")
        }
        else {
            req.body.password = hash;
            next();
        }
    });
}

module.exports = {
    hashing
}