const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const saltRound = 10;

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true, // space 없애는 역할
        unique: 1
    },
    password: {
        type: String,
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        defalut: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

// save를 하기전에 실행할 내용
userSchema.pre('save', function(next) {
    let user = this;

    if(user.isModified('password')) {
    
        // 비밀번호 암호화 시킨다.
        bcrypt.genSalt(saltRound, function (err, salt) {
            if(err) return next(err)
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err)
                user.password = hash;
                next()
            })
         })
    }
    else {
        next()
    }
})

userSchema.methods.comparePassword = function(plainPassword, cb) {
    
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if (err) return cb(err)
        cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function(cb) {
    let user = this;
    // jsonwebtoken을 이용해서 token 생성
    let token = jwt.sign(user._id.toHexString(), 'secretToken')

    user.token = token
    user.save((err, user) => {
        if(err) return cb(err)
        cb(null, user)
    })
}

userSchema.statics.findByToken = function(token, cb) {
    let user = this;

    // 토큰을 decode 한다
    jwt.verify(token, 'secretToken', (err, decoded) => {
        // 유저 아이디를 이용해서 유저를 찾은 다음 클라이언트의 토큰과 DB의 토큰을 비교
        user.findOne({"_id": decoded, "token": token}, (err, user) => {
            if (err) return cb(err);
            cb(null, user);
        })
    });
}

const User = mongoose.model('User', userSchema)

module.exports = {User}