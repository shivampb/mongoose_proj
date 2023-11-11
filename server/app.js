
const express = require('express');
const app = express();
const port = 5000;
const cors = require('cors');


// const corsOrigin = {
//     origin: 'http://localhost:3000',
// }
// app.use(cors(corsOrigin));
app.use(cors());
require('./db/conn');

app.use(express.json()); // convert user data into json format

require('./models/userSchema') // import schema model

app.use(require('./router/auth')) // import routers ( paths,  url )

// middleware
// const middleware = (req, res, next) => {
//     console.log(`hello middleware`);
//     next();

// }

//router for example purpose
// app.post('/', middleware, (req, res) => {
//     console.log(req.body);
//     res.send("shivam")
// })

// app.get('/signin', middleware, (req, res) => {
//     console.log(req.body);
//     // res.cookie("jwtcookie", 'cokiesssssssssss');
//     res.send("shivam")
// })

// app.get('/about', middleware, (req, res) => {
//     console.log(`hello about with middleware`);
//     res.send("this is about")
// })


//Declare port number using listen function 
app.listen(port, () => {
    console.log(`app is listing on ${port}`)
})