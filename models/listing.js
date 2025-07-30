const mongoose = require("mongoose");
const Review=require("./reviews.js");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        filename: { type: String,default:"Listing_Image"},
        url: { type: String, default:"https://images.unsplash.com/photo-1518684079-3c830dcef090?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZHViYWl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"}
    },
    price: Number,
    location: String,
    country: String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
})

listingSchema.pre('save', function(next) {
    if (this.image) {
        if (this.image.filename === '') {
            this.image.filename = undefined; // Will trigger default
        }
        if (this.image.url === '') {
            this.image.url = undefined; // Will trigger default
        }
    }
    next();
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;