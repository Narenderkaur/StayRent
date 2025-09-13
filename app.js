if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path'); 
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const session = require("express-session");
const MongoStore = require('connect-mongo');

const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
//routers
// const searchRouter = require("./routes/search.js");
const listingRouter = require('./routes/listing.js');
const reviewsRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');

//Db_connectivity
// const MONGO_URL = "mongodb://127.0.0.1:27017/WonderLust"; //default connectivity
const dbUrl = process.env.ATLASDB_URL;
main()
.then(()=>{console.log("Database Connected")})
.catch(err => console.log(err));
async function main() {
  // await mongoose.connect(MONGO_URL);
  await mongoose.connect(dbUrl);
}

app.engine('ejs', ejsMate);
app.set("view engine", 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

// app.use("/search", searchRouter);

const store = MongoStore.create({
  mongoUrl:dbUrl,
  crypto : {
    secret:process.env.SECRET,
  },
  touchAfter : 24*3600
});

store.on("error",(err)=>{
  console.log("ERROR IN MONGO SESSION STORE",err);
});

const sessionOptions = {
  store,
  secret: "mysupersecretcode",              // Used to sign the session ID cookie (should be long/random in real apps)
  resave: false,                              // Prevents session from being saved again if it wasn't modified
  saveUninitialized: true,                     // Save new sessions even if nothing is stored yet
  cookies:{
    expires: Date.now() + 7*24*60*60*1000 ,//week,hours in w,min in h,sec in m,millisec in s
    maxAge: 7*24*60*60*1000,
    httpOnly : true
  },
};

// app.get('/',(req,res)=>{
//   res.send("Hi , im root.");
// });

app.use(session(sessionOptions));
app.use(flash()); 

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//This middleware makes the flash message available to your EJS templates using res.locals.success.
app.use((req,res,next)=>{
  res.locals.success = req.flash("success"); //flash found here, it says next, means can access in ejs files where require(res.local)
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;//whatever info is in request related to user, currUser will store those info
  next();
});

app.get("/demouser",async (req,res)=>{
  let fakeUser = new User({
    email : "stu1@gmail.com",
    username : "stu1"
  });

//register(user, password, callBack) Convenience method to register a new user instance with a given password. Checks if username is unique. See login example.
  let registeredUser = await User.register(fakeUser , "stu1");//hmne abhi register karaya hai
  res.send(registeredUser);
})

app.use("/",userRouter);
app.use("/listings",listingRouter);//we used this line instead of whole code and avoided there a word which is nost commonly used->.listing
app.use("/listings/:id/reviews", reviewsRouter);              

app.all('*',(req,res,next)=>{
  next(new ExpressError(404,'Page not Found!'));
});

app.use((err,req,res,next)=>{
  let {statusCode=500, message="Something went wrong"} = err;
  // res.status(statusCode).send(message);
  res.status(statusCode).render('error.ejs', {message});
});

app.listen(8080,()=>{
    console.log("Server is listening at port 8080.");
});  