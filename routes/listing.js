const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require('../models/listing'); 
const {isLoggedIn, validateListing, isOwner}= require('../middleware.js');
const listingController = require('../controllers/listing.js');

const {storage} = require("../cloudConfig.js")
//multer lib used to upload files(imgs,pdfs);
const multer  = require('multer')
// const upload = multer({ dest: 'uploads/' })/this was by default storing files in upload folder
//now we want to store in the storage(cloudinary)
const upload = multer( {storage} );

//router.route is used when many methods work on same path 
router.route('/')
  .get(wrapAsync(listingController.index)) //Index Route
  .post( isLoggedIn, upload.single('listing[image]',validateListing,), wrapAsync(listingController.createListing));//create listing

  // 🔍 Search Route
router.get("/search", wrapAsync(async (req, res) => {
  const query = req.query.query || "";
  const regex = new RegExp(query, "i"); // case-insensitive regex

  const results = await Listing.find({
    $or: [
      { title: regex },
      { country: regex },
      { location: regex },
      { category: regex },
      { description: regex }
    ]
  });

  res.render("listings/index", { 
    allListings: results, 
    currentCategory: query 
  });
}));

router.get('/new', isLoggedIn,listingController.renderNewForm);//New Route
router.get("/category/:category", wrapAsync(listingController.filterByCategory)); // Route to filter listings by category
router.route("/:id")
  .get(wrapAsync(listingController.showListings))//Show Route(will show detail of particular id)
  .put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing))//Update Route
  .delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));//Delete Route

router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.editListing));//Edit Route

module.exports = router;