const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const secret_key = process.env.SECRET_KEY;

const Authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.jwttoken;
        const verifyToken = jwt.verify(token, secret_key);
        const rootUser = await User.findOne({ _id: verifyToken._id, "tokens.token": token });

        if (!rootUser) {
            return res.status(404).send("Unauthorized: User not found");
        }

        req.token = token;
        req.rootUser = rootUser;
        req.userID = rootUser._id;

        next();

    } catch (err) {
        return res.status(401).send("Unauthorized: No Token Provided");
    }
};

module.exports = Authenticate;
