const joi=require("joi");

module.exports.listingSchema = joi.object({
    listing:joi.object({
        title:joi.string().required(),
        description:joi.string().required(),
        location:joi.string().required(),
        country:joi.string().required(),
        price:joi.number().required().min(0),
        image: joi.object({
            filename: joi.string().allow(""),
            url: joi.string().allow(""),
        }).allow("")
    }).required()
});

module.exports.reviewSchema=joi.object({
    review:joi.object({
        comment:joi.string().required(),
        rating:joi.number().required().min(1).max(5),
    }).required()
});