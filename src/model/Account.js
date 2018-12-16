const mongoose = require('mongoose');

const Account = mongoose.model(
    'account', {id:String, userId:String, type:String, balance:Number}
)

module.exports = Account;