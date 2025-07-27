const express = require("express");
const router=express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema} = require("../schema.js");


const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,error);
    } else {
        next();
    }
};

//Index route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings })
}));


//New route
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
});


// Show route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error","Listing Not Available!");
        res.redirect("/listings");
    }else{
        res.render("listings/show.ejs", { listing });
    }
    
}));

// Create route
router.post("/",validateListing, wrapAsync(async (req, res, next) => {
    // let {title,description,image,price,country,location}=req.body;
    // let listing=req.body.listing;
    // console.log("Request Body:", req.body);
    // if(!req.body.listing){
    //     throw new ExpressError(400,"Send Valid Listing Data");
    // }
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
}));


// Edit route
router.get("/:id/edit", wrapAsync(async (req, res) => {
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
router.put("/:id",validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success","Listing updated!")
    res.redirect(`/listings/${id}`);
    // res.redirect("/listings");
}));


// Delete route
router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    console.log(deletedListing);
    res.redirect("/listings");
}));

module.exports=router;