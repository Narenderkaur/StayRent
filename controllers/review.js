const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  let listing = await Listing.findById(req.params.id);//it is now accessible bcoz, used {mergeParams : true} in router required(top)
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();
  await listing.populate({
    path: 'reviews',
    populate: { path: 'author' }
  });

  req.flash("success", "New review created!");
  res.render('listings/show', { listing });
}

  module.exports.destroyReview = async (req,res)=>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull : {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!"); //stored flash msg, it finds flash in app
    res.redirect(`/listings/${id}`);
  }