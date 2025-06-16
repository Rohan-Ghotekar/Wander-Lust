const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing");
const path =require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");


main().then(()=>{
    console.log("Connected to DB");
})
.catch((err)=>{
    console.log(err);
});

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


//Routes

app.get("/",(req,res)=>{
    res.send("I am root");
});

//Index route
app.get("/listings",async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings})
});


//New route
app.get("/listing/new",(req,res)=>{
    res.render("listings/new.ejs");
});


// Show route
app.get("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    const listing =await Listing.findById(id);
    res.render("listings/show.ejs",{listing})
});


// Create route
app.post("/listings",async (req,res)=>{
    // let {title,description,image,price,country,location}=req.body;
    // let listing=req.body.listing;
    const newListing =new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});


// Edit route
app.get("/listings/:id/edit",async(req,res)=>{
    let {id}=req.params;
    const listing =await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
});


// update route
app.put("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
    // res.redirect("/listings");
});


// Delete route
app.delete("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
});

// app.get("/testListing",async(req,res)=>{
//     let sampleListing=new Listing({
//         title:"My New Villa",
//         description:"By the beach",
//         price:1200,
//         location:"Goa",
//         country:"India",
//     })
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("Successful testing");
// });


app.listen(8085,()=>{
    console.log("server is listening to port 8085");
})