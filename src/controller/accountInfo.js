const Account = require('../model/Account');

function getCheckingInfo(req, res){
    if(req.isAuthenticated()){
        Account.findOne({$and:[{type:"checking"},{userId:req.user}]},(err, account)=>{
            if(err){console.error(err); res.status(501).json(err)}
            else if(account){res.status(200).json(account) }
            else{res.status(201).json('no result')            }
        })
    }else{
        res.status(401).json({authenticated:false})
    }
}

function getSavingInfo(req, res){
    if(req.isAuthenticated()){
        Account.findOne({$and:[{type:"saving"},{userId:req.user}]},(err, account)=>{
            if(err){console.error(err); res.status(501).json(err)}
            else if(account){res.status(200).json(account) }
            else{res.status(201).json('no result')            }
        })
    }else{
        res.status(401).json({authenticated:false})
    }
}


module.exports = {
    getCheckingInfo,
    getSavingInfo
}