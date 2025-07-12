const mongoose = require("mongoose");
const schema = mongoose.Schema;

const reviewsSchema=new schema({
    comment:String,
    rating :{
        type:Number,
        min:1,
        max:5
    },
    created_at:{
        type:Date,
        default:Date.now()
    }
});

const Review=mongoose.model("Review",reviewsSchema);
module.exports=Review;