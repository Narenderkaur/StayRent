const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js');
const Review = require('../models/review.js');
const User = require('../models/user.js');

const MONGO_URL = "mongodb://127.0.0.1:27017/StayRent";

main()
.then(()=>{console.log("Database Connected");})
.catch((err) => {console.log(err);});

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {  
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj)=>({...obj,owner : "689c1695568bc26f9d24bf78"}));
  await Listing.insertMany(initData.data);
  console.log("Data Initialized");  
};
initDB();
