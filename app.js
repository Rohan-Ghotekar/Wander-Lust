const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing");

main().then(()=>{
    console.log("Connected to DB");
})
.catch((err)=>{
    console.log(err);
});

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

app.get("/",(req,res)=>{
    res.send("I am root");
});
app.get("/testListing",async(req,res)=>{
    let sampleListing=new Listing({
        title:"My New Villa",
        description:"By the beach",
        price:1200,
        location:"Goa",
        country:"India",
    })
    await sampleListing.save();
    console.log("sample was saved");
    res.send("Successful testing");
});


app.listen(8085,()=>{
    console.log("server is listening to port 8085");
})