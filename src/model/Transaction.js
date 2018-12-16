const mongoose = require('mongoose');

const Transaction = mongoose.model('Transaction', {
    fromaccount: String,
    toaccount: String,
    amount: Number,
});
module.exports = Transaction;





// fromaccount: string;
//   toaccount: string;
//   amount: number;