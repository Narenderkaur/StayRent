const Joi = require ('joi');
const review = require ('./models/review');

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        location:Joi.string().required(),
        country:Joi.string().required(),
        price:Joi.string().required().min(0),
        image:Joi.object({
            url: Joi.string().allow("",null),
        }).optional (),
        category: Joi.string()
        .valid("Trending", "Rooms", "Cities", "Mountains", "Pool", "Camping", "Farms", "Arctic", "Boats", "Towers")
        .optional()
        }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating : Joi.number(),
        comment : Joi.string().required()
    }).required()
});