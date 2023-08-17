const Joi = require('joi');
const uploadValidator = (body) => {
    const schema = Joi.object().keys({ 
        category:Joi.string().required().label("category"),
        title : Joi.string().required().label("title"),
        description :Joi.string().required().label("description"),  
        composer : Joi.string().required(),  
        image : Joi.object().label("imagefile"),
        audio : Joi.object().label("audiofile")
    })
    return schema.validate(body);
}
const updateValidator = (body) => {
    const schema = Joi.object().keys({ 
        podcast_id : Joi.string().label("podcastID"),
        category:Joi.string().required().label("category"),
        title : Joi.string().required().label("title"),
        composer : Joi.string().required(), 
        description :Joi.string().required().label("description"),    
        image : Joi.object().label("imagefile"),
        audio : Joi.object().label("audiofile")
    })
    return schema.validate(body);
}
module.exports={
    uploadValidator,
    updateValidator
}