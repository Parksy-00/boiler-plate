const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 5000
const mongoose = require('mongoose')
const { User } = require("./models/User")

const config = require('./config/key');

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

//application/json
app.use(bodyParser.json());

mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
})
.then(()=>console.log('MongoDB connected...'))
.catch(err => console.log(err))

app.post('/register', (req, res) => {
    // 회원 가입 할때 필요한 정보들을 DB에 넣어줌
    const user = new User(req.body);

    user.save((err, doc) => {
        if(err) return res.json({success: false, err})
        return res.status(200).json({success: true})
    })
})

app.listen(port, () => console.log("Example app listening on port 5000!"))