const AccountActivity = require('../model/AccountActivity');
const UserInfo = require('../model/UserInfo');
const Account = require('../model/Account');

function getCheckingAccountActivities(req, res){
    if(req.isAuthenticated){
        let newAccountActivity = new AccountActivity({
            timeStamp:new Date(),accountId:'12345', amount:3000, description:"internal transaction", category:"personal", transactionAccount:"67890"})
        Account.findOne({$and:[{userId:req.user}, {type:'checking'}]}, (err, account) => {
            if(err){}
            else if(account){
                AccountActivity.find({accountId:account.id}, (err, activities) =>{
                    console.log('inside get checking account activity');
                    console.log(activities);
                    res.json(activities);
                })
            }else{res.status(201).json('user not found')}
        })
    }else{
        res.status(401).json({authenticated:false})
    }
}

function getSavingAccountActivities(req, res){
    if(req.isAuthenticated){    
        Account.findOne({$and:[{userId:req.user}, {type:'saving'}]}, (err, account) => {
            if(err){}
            else if(account){
                AccountActivity.find({accountId:account.id}, (err, activities) =>{
                    console.log('inside get saving account activity');
                    console.log(activities);
                    res.json(activities);
                })
            }else{res.status(201).json('user not found')}
        })
    }else{
        res.status(401).json({authenticated:false})
    }
}

module.exports = {
    getCheckingAccountActivities,
    getSavingAccountActivities
}