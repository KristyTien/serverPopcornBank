const UserInfo = require('../model/UserInfo');

function getUserInfo(req,res){
    if(req.isAuthenticated()){
        UserInfo.findOne({id:req.user}, (err, userInfo)=>{
            res.status(200).json(userInfo);
        })
    }else{
        res.status(401).json({authenticated:false})
    }
}

module.exports = {
    getUserInfo,
}