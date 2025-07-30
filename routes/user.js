const express = require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl}=require("../middleware.js");


router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup",wrapAsync( async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        const newUser=new User({username,email});
        let RegisteredUser=await User.register(newUser,password);
        console.log(RegisteredUser);
        req.login(RegisteredUser,(err)=>{
            if(err){
                next(err);
            }
            req.flash("success","Welcome To WonderLust!!");
            res.redirect("/listings"); 
        });
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}));


// login routes
router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
})

router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true,}),async(req,res)=>{
        req.flash("success","welcome back to WonderLust!");
        let redirectUrl=res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
});

// logout route
router.get("/logout",(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","You are Logged Out!");
        res.redirect("/listings");
    })
});

module.exports=router;