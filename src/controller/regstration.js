const UserInfo = require('../model/UserInfo');
const User = require('../model/User');

function postRegister(req, res){
    console.log(req.body);
    checkUsernameExists(req.body.username)
    .then((result) => {
        let newUser = new User({
            username:req.body.username, 
            password:req.body.password, 
            checking_account:req.body.checking_account, 
            saving_account:req.body.saving_account});
        newUser.save()
        .then((result)=>{
            res.status(200).json({success:true})

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
    User.find({})
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