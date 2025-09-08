const User = require("../models/user");

module.exports.renderSigupForm = (req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.signup = async (req,res)=>{
    try{
        let {username, email,password} = req.body;

        // Check if the email already exists
        const existingUser = await User.findOne({ email });//by default it checks username but not email
            if (existingUser) {
                req.flash("error", "A user with this email already exists.");
                return res.redirect("/signup");
            }
        const newUser = new User({email , username});
        const reqgisteredUser = await User.register(newUser , password);
        // console.log(reqgisteredUser);
        req.login(reqgisteredUser,(err)=>{//method which takes credentials from signup and automatically logged into.
            if(err){
                return next(err);
            }
            req.flash("success" , "Welcome back to wonderlust! :)");
            res.redirect("/listings");
        });
        
    }catch(e){
        req.flash("error",e.message)
        res.redirect("/signup");
    }
};

module.exports.login = async (req,res)=>{
    req.flash("success" , "You are successfully logged into Wonderlust" )
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res,next)=>{
    //inbult fun logout which actually works as logout and take u out
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash('success' , "you are successfully logged out! ");
        res.redirect('/listings');
    });
}