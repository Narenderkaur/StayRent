const mongoose = require ('mongoose');
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { array } = require('joi');

const ListingSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    description : String,
    image : {
        url : String,
        filename : String,
    },
    price : Number,
    location : String,
    country : String,
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review",
        },
    ],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },  
    geometry : {
        type : {
            type: String,
            enum : ['Point'],
            required : true
        },
        coordinates : {
            type : [Number],
            required : true
        },
    },
    
    category : {
        type : String,
        enum : ["Trending","Rooms","Mountains","Pools","Cities","Camping","Farms","Arctic","Boats","Towers"]
    },
    
});

ListingSchema.index({ location: "text" });

//when we delete a listing card , reviews also should be deleted from database
ListingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in : listing.reviews}});
    }
});

const Listing = mongoose.model("Listing", ListingSchema);
module.exports = Listing;
