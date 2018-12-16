const Transaction = require('../model/Transaction');
const AccountActivity = require('../model/AccountActivity');
const Account = require('../model/Account');

function postTransaction (req, res){
    Promise.all([checkAccountExists(req.body.fromaccount), checkAccountExists(req.body.toaccount)])
    .then( (result) => {if(result[0] && result[0]){
        // both accounts found
        let fromAccount = result[0][0];
        let toAccount = result[1][0];

        let fromAccountNewBalance = fromAccount.balance - req.body.amount;
        let toAccountNewBalance = toAccount.balance + req.body.amount;

        Promise.all([transferMoney(fromAccount.id, fromAccountNewBalance), transferMoney(toAccount.id, toAccountNewBalance)])
        .then(
            (result) =>{
                let fromAccountActivity = new AccountActivity({
                    accountId: fromAccount.id,
                    timeStamp: Date.now(),
                    amount: -req.body.amount,
                    description:'transaction',
                    transactionAccount:toAccount.id
                });
                let toAccountActivity = new AccountActivity({
                    accountId: toAccount.id,
                    timeStamp: Date.now(),
                    amount: req.body.amount,
                    description:'transaction',
                    transactionAccount:fromAccount.id
                });
                fromAccountActivity.save().then(console.log('from account new activity saved'));
                toAccountActivity.save().then(console.log('to account activity saved'));
                
                res.json({success:true});
            }

        ).catch(
            (err) =>{console.error(err)}
        )
        
        

    }}).catch((err) => {
        console.error(err);
    })
}
function postWithdraw(req, res){
    console.log(req.body);
    checkAccountExists(req.body.accountnumber).then(
        (account) => {
            console.log('account exists');
            console.log(account);
            Account.findOneAndUpdate({id:account[0].id}, {balance: account[0].balance - req.body.amount}, (err, result)=>{
                if(err){console.error(err)}
                else{
                    console.log(`withdraw completed`);
                    let accountActivity = new AccountActivity({
                        accountId:account[0].id,
                        timeStamp: Date.now(),
                        amount: -req.body.amount,
                        description:'cash withdraw',
                        transactionAccount:account[0].id

                    });
                    accountActivity.save().then(
                        (result) =>{
                            console.log('activity saved')
                            res.json({success:true})
                        }
                    )
                }
            })
        }
    )


}
function postDeposit(req, res){
    console.log(req.body);

    checkAccountExists(req.body.accountnumber).then(
        (account) => {
            console.log('account exists');
            console.log(account);
            Account.findOneAndUpdate({id:account[0].id}, {balance: account[0].balance + req.body.amount}, (err, result)=>{
                if(err){console.error(err)}
                else{
                    console.log(`deposit completed`);
                    let accountActivity = new AccountActivity({
                        accountId:account[0].id,
                        timeStamp: Date.now(),
                        amount: -req.body.amount,
                        description:'cash deposit',
                        transactionAccount:account[0].id

                    });
                    accountActivity.save().then(
                        (result) =>{
                            console.log('activity saved')
                            res.json({success:true})
                        }
                    )
                }
            })
        }
    )
}

function checkAccountExists(accountId){
    return new Promise((resolve, reject) => {
        Account.find({id:accountId}, (err, account)=>{
            if (err) {console.error(err)}
            else if(account.length == 1){
                resolve(account)
            }else{
                reject('file does not exist');
            }
        })
        })
}
function transferMoney(accountId, newBalance){
    return new Promise((resolve, reject) => {
        Account.findOneAndUpdate({id:accountId},{balance:newBalance}, (err, update)=>{
            if(err){console.error(err)}
            else{
                resolve('money transfered');
            }
        })

    })
}

module.exports = {
    postTransaction,
    postWithdraw,
    postDeposit,
}