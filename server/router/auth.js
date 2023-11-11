const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate')
const cookieParser = require('cookie-parser');


const bcrypt = require('bcrypt');
router.use(cookieParser());

// for storing db


require("../db/conn");  // notice DOUBLE [ . ]
const User = require('../models/userSchema');



//post using ASYNC AWAIT  ( Recommeded)----------------------

router.post('/register', async (req, res) => {

    const { name, email, phone, password, cpassword } = req.body;

    if (!name || !email || !phone || !password || !cpassword) {
        return res.status(422).json({ error: "beta chalaki nai, sab likhna padega" });
    }

    try {
        const userExist = await User.findOne({ email: email })  //left wala db ka right wala user ka checks both if already exits in db then show error


        if (userExist) {
            return res.status(422).json({ error: "tu pehale se hi exist karta hai, nikal le" });
        } else if (password != cpassword) {
            return res.status(422).json({ error: "both password must be same" });
        } else {

            const user = new User({ name, email, phone, password, cpassword });
            await user.save()
            res.status(201).json({ message: "inserted into database" });

        }


    } catch (err) {
        console.log(err);
    }
});

//post singin

router.post('/login', async (req, res) => {
    try {

        var token;
        const { email, password } = req.body;

        // Find the user by email
        const userLogin = await User.findOne({ email });

        // Check if the user exists
        if (!userLogin) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        token = await userLogin.generateAuthToken();
        console.log(token)
        // Set the token as a cookie (if needed)
        res.cookie("jwttoken", token, {
            expiresIn: '5d',
            httpOnly: true
        })
        // Compare the provided password with the hashed password
        const passwordMatch = await bcrypt.compare(password, userLogin.password);


        if (passwordMatch) {
            res.status(200).json({ message: 'success signin' })

        } else {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Respond with the token or any other data

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'JWT token error' });
        }

        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.post('/about', authenticate, async (req, res) => {
    console.log("i am about");
    res.send(req.rootUser);
});




module.exports = router;
