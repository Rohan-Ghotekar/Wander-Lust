const express = require("express");
const router=express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");



//Index route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings })
}));


//New route
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
});


// Show route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:({path:"author"})}).populate("owner");
    if(!listing){
        req.flash("error","Listing Not Available!");
        res.redirect("/listings");
    }else{
        res.render("listings/show.ejs", { listing });
    }
    
}));

// Create route
router.post("/",validateListing,isLoggedIn, wrapAsync(async (req, res, next) => {
    // let {title,description,image,price,country,location}=req.body;
    // let listing=req.body.listing;
    // console.log("Request Body:", req.body);
    // if(!req.body.listing){
    //     throw new ExpressError(400,"Send Valid Listing Data");
    // }
    const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
}));


// Edit route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing Not available!");
        res.redirect("/listings");
    }else{
    res.render("listings/edit.ejs", { listing });
    }
}));

// update route
router.put("/:id",isLoggedIn,isOwner,validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success","Listing updated!")
    res.redirect(`/listings/${id}`); 
    // res.redirect("/listings");
}));


// Delete route
router.post("/:id", isLoggedIn,isOwner,wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    console.log(deletedListing);
    res.redirect("/listings");
}));

module.exports=router;