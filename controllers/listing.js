const Listing = require("../models/listing");
const mbxGeocoding= require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });



module.exports.index = async (req, res) => {
  const { category } = req.query;
  let allListings;

  if (category) {
    allListings = await Listing.find({ category });
  } else {
    allListings = await Listing.find({});
  }

  res.render("listings/index", { allListings, currentCategory: category || "All" });
};


module.exports.renderNewForm = (req,res)=>{
  res.render('listings/new');
}

module.exports.showListings = async(req,res)=>{
      let {id} = req.params;
      const listing = await Listing.findById(id)
        .populate({
        path: 'reviews',
        populate: {
            path: 'author', // Populate the author field of each review
            model: 'User'
        }
    })
      .populate("owner");
    
      if(!listing){
        req.flash("error","Listing Not Found");
        return res.redirect('/listings');
      }
      // console.log(listing);
      res.render('listings/show',{listing});
    }
//save link in mongo
module.exports.createListing = async (req, res,next) => {
  let response = await geocodingClient 
    .forwardGeocode({
      query: req.body.listing.location,
      limit : 1,
    })
    .send();

    let url = req.file.path;                                                                                      
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    newListing.geometry = response.body.features[0].geometry;
    let save = await newListing.save(); // Save to the database
    // console.log(save);
    req.flash("success","New Listing Created!"); //stored flash msg, it finds flash in app
    res.redirect('/listings'); // Redirect to the listings page
    }

module.exports.editListing = async (req,res) =>{
  let {id} = req.params;
  const listing = await Listing.findById(id);
  if(!listing){
    req.flash("error","Listing Not Found");
    res.redirect('/listings');
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");

  res.render('listings/edit',{listing , originalImageUrl});
}

module.exports.updateListing = async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

  if(req.file){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save();
  }
    req.flash("success","Listing Updated!"); //stored flash msg, it finds flash in app
    res.redirect(`/listings/${id}`);
  };

module.exports.deleteListing = async(req,res)=>{
    let {id} = req.params;
    let delList = await Listing.findByIdAndDelete(id);
    // console.log(delList);
    req.flash("success","Listing Deleted!"); //stored flash msg, it finds flash in app
    res.redirect("/listings");
    }
