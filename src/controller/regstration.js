const UserInfo = require('../model/UserInfo');
const User = require('../model/User');
const uuid = require('uuid/v4');
const Account = require('../model/Account');

function postRegister(req, res){
    console.log(req.body);
    checkUsernameExists(req.body.username)
    .then((result) => {
        let newUser = new User({
            id:uuid(),
            username:req.body.username, 
            password:req.body.password, 
            checking_account:req.body.checking_account, 
            saving_account:req.body.saving_account});
        newUser.save()
        .then((result)=>{
            
            let newSavingAccount = new Account({
                id:req.body.saving_account,
                userId: newUser.id,
                type:'saving',
                balance:0
            });
            let newCheckingAccount = new Account({
                id:req.body.checking_account,
                userId: newUser.id,
                type:'checking',
                balance:0
            });
            newCheckingAccount.save(); newSavingAccount.save();
            res.status(200).json({success:true});
        })
        .catch((err) => {console.error(err)})

    })
    .catch(
        (err) => {
            console.error(err)
            res.status(201).json({success:false})
        }
    )
}
function postAddUserInfo(req, res){
    console.log(req.body);
    console.log(req.session.passport.user);
    User.findOne({id:req.session.passport.user}, (err, user) =>{
        if(err){console.error(err); res.status(501).json({success:false})}
        else if(user){
            let newUserInfo = new UserInfo({
                id:req.session.passport.user,
                firstname:req.body.firstname, 
                lastname:req.body.lastname, 
                address:req.body.address, 
                city:req.body.city, 
                state:req.body.state, 
                zipcode:req.body.zipcode,
                saving_account:user.saving_account,
                checking_account:user.checking_account
            });
            newUserInfo.save().then(
                (result) => {
                    console.log('user info saved');
                    res.status(200).json({success:true})
                }
            )
        }
        else{
            console.log('user not found');
            req.status(201).json({success:false});
        }
    })
}
function checkUsernameExists(username){
    return new Promise((resolve, reject) => {
        User.find({username:username}, (err, result)=>{
            if(err){console.error(err); reject(err)}
            else if(result.length > 0)
            {console.log('user already exists');
                reject('user name already exists');
            }else{
                console.log(result);
                resolve();
            }
        })
        })
    
}

module.exports = {
    postRegister,
    postAddUserInfo
}