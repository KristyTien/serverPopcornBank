const mongoose = require('mongoose');

const UserInfo = mongoose.model(
    'userInfo', {id:String, 
        firstname:String, 
        lastname:String, 
        address:String, 
        city:String, 
        state:String, 
        zipcode:String,
        saving_account:String,
        checking_account:String
    }
)

module.exports = UserInfo;