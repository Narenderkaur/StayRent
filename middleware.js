const ExpressError = require('./utils/ExpressError.js');
const {listingSchema , reviewSchema} = require('./schemaValidation.js');
const Listing = require ("./models/listing");
const Review = require('./models/review');
  
module.exports.validateListing = (req,res,next)=>{
  let {error} =  listingSchema.validate(req.body);
  // console.log(result); 

  if(error){
    throw new ExpressError(400, error);
  }else{
    next();
  }
};

module.exports.validateReview = (req,res,next)=>{
  let {error} =  reviewSchema.validate(req.body);
  // console.log(result);
  if(error){
    const msg = error.details.map(el => el.message).join(', '); // Extract error messages
    throw new ExpressError(400, msg);
  }else{
    next();
  }
};

module.exports.isLoggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()){//checks the current status of not login then err occur
      req.session.redirectUrl = req.originalUrl;//jaha se kaha gya tha login kre,wahi wapas aana. Ex:new/edit
        req.flash("error","You must be logged in to do any action here.");
        return res.redirect("/login");
      }
      next();
};

module.exports.saveRedirectUrl = (req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async(req,res,next)=>{
  let listing = await Listing.findById(req.params.id);
  if(!listing.owner.equals(res.locals.currUser._id)){
    req.flash("error","You dont have permission.");
    return res.redirect(`/listings/${req.params.id}`);
  }
  next();
};

module.exports.isReviewAuthor = async(req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the author of this review :(");
    return res.redirect(`/listings/${id}`);
  }
  next();
};