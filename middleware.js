const Listing=require("./models/listing.js");
const Review=require("./models/reviews.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema,reviewSchema} = require("./schema.js");


// Logged in
module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","Please Login!");
        return res.redirect("/login");
    }
    next();
};

// redirect to the requested page
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};

// check owner
module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!(listing.owner._id.equals(res.locals.currUser._id))){
        req.flash("error","You don't have Permission!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

// validation middleware for listings
module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,error);
    } else {
        next();
    }
};

// validation middleware for Reviews
module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,error);
    } else {
        next();
    }
};

// Check author
module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!(review.author._id.equals(res.locals.currUser._id))){
        req.flash("error","You are not the author of this Review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};