const mongoose = require('mongoose');

const User = mongoose.model('users', {
    id:String,
    username: String,
    password:String,
    firstName: String,
    lastName: String,
    email: String,
    checking_account:String,
    saving_account: String,
    role:String
})

module.exports = User;