const mongoose=require("mongoose");
const initData=require("./data.js")
const Listing=require("../models/listing.js");

main().then(()=>{
    console.log("Connected to DB");
})
.catch((err)=>{
    console.log(err);
});

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}


const initDataBase= async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({
            ...obj,
            owner:'68875aa327460cb6d35ced52',
    }));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
}

initDataBase();