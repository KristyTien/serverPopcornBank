const express = require('express');
const mongoose = require('mongoose');
const keys = require('./keys.json');
const cors = require('cors');

const uuid = require('uuid/v4');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const bodyParser = require ('body-parser');

const passport = require('passport');
const LogcalStrategy = require('passport-local').Strategy;

const User = require('./model/User');
const Cat = require('./model/Cat');

const {getUserInfo} = require('./controller/userInfo');
const {getCheckingInfo, getSavingInfo} = require('./controller/accountInfo');
const {getCheckingAccountActivities, getSavingAccountActivities} = require('./controller/accountActivity');
const {postTransaction, postDeposit, postWithdraw} = require('./controller/transaction');
const {postRegister, postAddUserInfo} = require('./controller/regstration');

// database connection 
mongoose.connect(keys.database.atlasConnection); 
const db = mongoose.connection;
db.on('open',()=>{console.log('mongodb PopcornBank connected')});

// mongo session store configuration
const store = new MongoDBStore({
    uri:keys.database.atlasConnection,
    collection:'session'
});
store.on('error', (error) => {
    console.error(error);
});


// passport configuration
passport.use(new LogcalStrategy(
    (username, password, done) =>{
        // passport will find username and password automatically,
        User.find({username:username, password:password}, (err, user) =>{
            if(err){
                console.error(`data base error ${err}`);
                return done(null, null);
            }
            else if(user.length === 1){
                console.log(`log in found user`);
                console.log(user);
                return done(null, user[0]);
            }else{
                return done(null, null);
            }
        })
    }
))

passport.serializeUser((user, done) =>{
    done(null,user.id);
})

passport.deserializeUser((id, done) => {
        done(null, id);
  });

// server configurations 
const server = express();

const secret = process.env.SECRET || 'helloWorld';
const port = process.env.port || '8080';

//server configuration: cors
server.use(bodyParser.urlencoded({extended:false}));
server.use(bodyParser.json());
const corsOptions = {
    origin: true,
    optionsSuccessStatus: 200 ,
    credentials:true
  }
server.use(cors(corsOptions));

//server configuration : passport session
server.use(session({
    genid:(req) =>{
        console.log('create new session id');
        console.log(req.sessionID);
        return uuid()
    },
    secret:secret, 
    resave:false,
    saveUninitialized:true,
    store:store
}))
server.use(passport.initialize());
server.use(passport.session());


const loginPost = (req, res, next) =>{
    console.log('hello this is login post');
    passport.authenticate('local', (err, user, info) =>{
        req.login(user, (err)=>{
            if(user){
                console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`);
            console.log(`req.user: ${JSON.stringify(req.user)}`);
            return res.status(200).json({success:true});
            }else{
                return res.status(200).json({success:false});
            }
            
        })
    })(req, res, next);
}
const logout = (req, res, next) =>{
    req.logout();
    res.json('you logged out lol');
}

const protected = (req, res) =>{
    console.log(req.isAuthenticated());
    res.json('hahah');
}

server.listen(port);

console.log('popcorn bank server is running...');


server.post('/login',loginPost);
server.get('/logout',logout);
server.get('/user_info', getUserInfo);
server.get('/checking_account_info', getCheckingInfo);
server.get('/saving_account_info', getSavingInfo);
server.get('/checking_account_activity', getCheckingAccountActivities);
server.get('/saving_account_activity', getSavingAccountActivities);
server.post('/transfer', postTransaction);
server.post('/deposit', postDeposit);
server.post('/withdraw', postWithdraw);
server.post('/register', postRegister);
server.post('/user_info', postAddUserInfo);

// server.get('/protected',protected);


// const helloKitty = new Cat({name:'Hell Kitty', color:'red', size:'L'});
// helloKitty.save().then(() =>{console.log('kitty saved')});
// Cat.find({name:'Hell Kitty'}, (err, cat) =>{console.log(cat)});

// let newUser = new User({id:uuid(), userId:'kristy2', password:'isGoingToGoogle', firstName:'kristy', lastName:'Tien', email:'kristy4500@gmail.com', checkingAccount:'abc', savingAccount:'123', role:'sysadmin'})
// newUser.save().then(()=>{console.log('user saved!')});