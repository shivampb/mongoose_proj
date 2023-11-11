const dotenv = require("dotenv")
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE;

mongoose.connect(DB).then(() => {
    console.log("databased connected")
}).catch((error) =>
    console.log(`samayasa hai baidu db me ${error}`)
)

    