const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv")
dotenv.config({ path: './config.env' });
const secret_key = process.env.SECRETE_KEY;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    cpassword: {
        type: String,
        required: true
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
});

userSchema.pre('save', async function (next) {
    try {
        if (this.isModified('password')) {
            this.password = await bcrypt.hash(this.password, 12);
            this.cpassword = await bcrypt.hash(this.cpassword, 12);
        }
    } catch (error) {
        return next(error);
    }
    next();
});


userSchema.methods.generateAuthToken = async function () {
    try {
        let token = jwt.sign({ _id: this._id }, secret_key);
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    } catch (err) {
        console.error('Error generating token:', err);
        throw err; // Rethrow the error to handle it elsewhere if needed
    }
}


// userSchema.methods.generateAuthToken = async function () {
//     try {
//         const secret_key = 'abcdefghijklmnopqrstuvwxyz';
//         let token = jwt.sign({ _id: this._id }, secret_key);
//         this.tokens = this.tokens.concat({ token: token });
//         await this.save();
//         return token;
//     } catch (err) {
//         console.error('Error generating token:', err);
//         throw err; // Rethrow the error to handle it elsewhere if needed
//     }
// }


// Collection creation
const User = mongoose.model('USER', userSchema);

module.exports = User;
