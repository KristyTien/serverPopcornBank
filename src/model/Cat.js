const mongoose = require('mongoose');

const Cat = mongoose.model(
    'Cat', {name:String, color:String, size:String}
)
module.exports = Cat;