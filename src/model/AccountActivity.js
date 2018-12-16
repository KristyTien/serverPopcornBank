const mongoose = require('mongoose');

const AccountActivity = mongoose.model(
    'accountActivity', {timeStamp:Date, accountId:String, amount:Number, description:String, category:String, transactionAccount:String}
)

module.exports = AccountActivity;