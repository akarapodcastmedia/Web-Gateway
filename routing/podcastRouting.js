const express = require("express");
const route   = express.Router();
const jsonwebtoken = require("jsonwebtoken");
const db  = require('../db/mongoConfig');
const multer  = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const axios = require("axios");
const FormData = require('form-data');
const {TokenValidator} = require('../middleware/middlware');
const {uploadValidator, updateValidator} = require('../validation/validation');
db();

// d=======================================
// UPLOAD PODCAST BY WEB
//=========================================
route.post('/upload/podcast',TokenValidator,upload.fields([{maxCount : 1 , name : "image"},{maxCount : 1 , name : "audio"}]),async(req,res)=>{
    // validate data input 
    const {error} = uploadValidator(req.body);
    if(error){
        return res.json({
            error : true,
            message : error.message
        })
    }else{
        // if no error during input from the client 
        const token = jsonwebtoken.sign({user:req.session.user,role:req.session.role,email:req.session.email,identify:req.identify},process.env.PROGRAM_TOKEN_SECRET,{expiresIn : '5min'});
        const my_file = new FormData();
        my_file.append("image",req.files["image"][0].buffer,{filename : req.files["image"][0].fieldname});
        my_file.append("audio", req.files["audio"][0].buffer,{filename : req.files["audio"][0].fieldname});
        my_file.append("title",req.body.title);
        my_file.append("composer",req.body.composer);
        my_file.append("category",req.body.category);
        my_file.append("description",req.body.description);
        my_file.append("image_type",req.files['image'][0].mimetype);
        my_file.append("audio_type",req.files['audio'][0].mimetype);
        axios.defaults.headers.common['Authorization'] = `bearer ${token}`;
        try{
            const data = await axios.post("https://dev.akarahub.tech/server3/discover/podcast/upload/podcast",
           my_file
        ,{
           headers : {
               "content-Type": "multipart/form-data",
           }
        });
        // if it return success 
        return res.json(data.data);
        }catch(e){
            return res.json({
                error : true,
                message : e.message
            })
        }    
    }  
});
// ========================================
// DELETE PODCAST 
// ========================================
route.post('/delete/podcast',TokenValidator,async(req,res)=>{
    const id = req.body.podcast_id ;
    const token = jsonwebtoken.sign({user:req.session.user,role:req.session.role,email:req.session.email,identify:req.identify},process.env.PROGRAM_TOKEN_SECRET,{expiresIn : '5min'});
    axios.defaults.headers.common['Authorization'] = `bearer ${token}`;
    console.log(id);
    const deleted = await axios.post("https://dev.akarahub.tech/discover/podcast/delete/podcast",
    {  podcast_id: id  }
    , 
    {
        headers : {
        "content-Type": "application/json",
    } 
    });
    return res.json(deleted.data);
});
// =========================================
// UPDATE PODCAST 
// =========================================
route.post('/update/podcast',TokenValidator,upload.fields([{maxCount : 1 , name : "image"},{maxCount : 1 , name : "sound"}]),async(req,res)=>{
    const {error} = updateValidator(req.body);  
    if(error){
        return res.json({
            error : true,
            message : error.message
        })
    }else{
        // if no error during input from the client 
        try{
            const token = jsonwebtoken.sign({user:req.session.user,role:req.session.role,email:req.session.email,identify:req.identify},process.env.PROGRAM_TOKEN_SECRET,{expiresIn : '5min'});
            const my_file = new FormData();
            if(req.files["image"] && req.files["sound"]){
               
                my_file.append("file_image",req.files["image"][0].buffer,{filename : req.files["image"][0].fieldname});
                my_file.append("file_audio", req.files["sound"][0].buffer,{filename : req.files["sound"][0].fieldname});
                my_file.append("podcast_id",req.body.podcast_id);
                my_file.append("title",req.body.title);
                my_file.append("composer",req.body.composer);
                my_file.append("category",req.body.category);
                my_file.append("description",req.body.description);
                my_file.append("image_type",req.files['image'][0].mimetype);
                my_file.append("sound_type",req.files['sound'][0].mimetype);
                //console.log("cu1");

            }else if(req.files["image"] == undefined && req.files["sound"] == undefined){
                //console.log("cu2");
                my_file.append("podcast_id",req.body.podcast_id);
                my_file.append("title",req.body.title);
                my_file.append("category",req.body.category);
                my_file.append("composer",req.body.composer);
                my_file.append("description",req.body.description);
               
            }else if(req.files["image"] == undefined){
                //console.log("cu3");
                my_file.append("file_audio", req.files["sound"][0].buffer,{filename : req.files["sound"][0].fieldname});
                my_file.append("podcast_id",req.body.podcast_id);
                my_file.append("title",req.body.title);
                my_file.append("category",req.body.category);
                my_file.append("composer",req.body.composer);
                my_file.append("description",req.body.description);
                my_file.append("sound_type",req.files['sound'][0].mimetype);

            }else if (req.files["sound"] == undefined){
                //console.log("cu4");
                my_file.append("file_image",req.files["image"][0].buffer,{filename : req.files["image"][0].fieldname});
                my_file.append("podcast_id",req.body.podcast_id);
                my_file.append("title",req.body.title);
                my_file.append("composer",req.body.composer);
                my_file.append("category",req.body.category);
                my_file.append("description",req.body.description);
                my_file.append("image_type",req.files['image'][0].mimetype);
            }

            axios.defaults.headers.common['Authorization'] = `bearer ${token}`;
            try{
               const update = await axios.post("http://localhost:4000/discover/podcast/update/podcast",
               my_file
            ,{
               headers : {
                   "content-Type": "multipart/form-data",
               }
            });
            return res.json(update.data );
            }catch(e){
                return res.json({
                    error : true,
                    message : e.message
                })
            }
        }catch(e){
            return res.json({
                error : true,
                message : e.message
            })
        }   
    }  
});
// ===============================================
// GET ALL PODCASTS
//================================================
route.get('/list/podcast',TokenValidator,async(req,res)=>{
    const token = jsonwebtoken.sign({user:req.session.user,role:req.session.role,email:req.session.email},process.env.PROGRAM_TOKEN_SECRET,{expiresIn : '5min'});
    axios.defaults.headers.common['Authorization'] = `bearer ${token}`;
    const data = await axios.get("http://localhost:4000/discover/podcast/list/listallpodcast");
    return res.json(data.data);
});

// =================================================
// GET ALL  podcaster
//==================================================
// route.get('/list/podcast/podcaster',TokenValidator,async(req,res)=>{
//     const token = jsonwebtoken.sign({user:req.session.user,role:req.session.role,email:req.session.email},process.env.PROGRAM_TOKEN_SECRET,{expiresIn : '5min'});
//     axios.defaults.headers.common['Authorization'] = `bearer ${token}`;
//     const data = await axios.get("http://localhost:4000/discover/podcaster/list/all/listallpodcaster");
//     return res.json(data.data);
// })

// ==================================
// GET PODCASTS BY CATEGORY
//===================================
route.post('/list/podcast/category',async(req,res)=>{
    const category = req.body.category;
    const token = jsonwebtoken.sign({user:req.session.user,role:req.session.role,email:req.session.email},process.env.PROGRAM_TOKEN_SECRET,{expiresIn : '5min'});
    axios.defaults.headers.common['Authorization'] = `bearer ${token}`;
    const data = await axios.post("http://localhost:4000/discover/category/list/all/categorylistall",
    {
        categoryName : category
    },{
        headers : {
            "Content-Type" : "Application/json"
        }
    });
    return res.json(data.data);
});
//====================================================
// REGENERATE URL 
//====================================================
route.post("/generate/url/forever",async(req,res)=>{
    const token = jsonwebtoken.sign({user:req.session.user,role:req.session.role,email:req.session.email},process.env.PROGRAM_TOKEN_SECRET,{expiresIn : '5min'});
    axios.defaults.headers.common['Authorization'] = `bearer ${token}`;
    const data = await axios.post("http://localhost:4000/discover/podcast/regenerate/podcast/forever",{
        headers : {
            "content-type" : "application/json"
        }
    })
    return res.json(data.data);
})
//====================================================
// STOP REGENERATING URL 
//====================================================
route.post("/stop/url/forever",async(req,res)=>{
    const token = jsonwebtoken.sign({user:req.session.user,role:req.session.role,email:req.session.email},process.env.PROGRAM_TOKEN_SECRET,{expiresIn : '5min'});
    axios.defaults.headers.common['Authorization'] = `bearer ${token}`;
    const data = await axios.post("http://localhost:4000/discover/podcast/stop/regenerate/podcast",{
        headers : {
            "content-type" : "application/json"
        }
    })
    return res.json(data.data);
})
// =================================================
// BAN PODCAST
//==================================================
route.post("/ban/podcast",async(req,res)=>{
    const podcast_id = req.body.podcast_id;
    const token = jsonwebtoken.sign({user:req.session.user,role:req.session.role,email:req.session.email},process.env.PROGRAM_TOKEN_SECRET,{expiresIn : '5min'});
    axios.defaults.headers.common['Authorization'] = `bearer ${token}`;
    const data = await axios.post("http://localhost:4000/discover/podcast/ban/banpodcast",
        {
            podcast_id : podcast_id
        }
    ,{
        headers : {
            "content-type" : "application/json"
        }
    }
     ,
    );
    return res.json(data.data);
})

//=============================================
// DISBAN PODCAST 
// ============================================
route.post("/disban/podcast",async(req,res)=>{
    const podcast_id = req.body.podcast_id;
    const token = jsonwebtoken.sign({user:req.session.user,role:req.session.role,email:req.session.email},process.env.PROGRAM_TOKEN_SECRET,{expiresIn : '5min'});
    axios.defaults.headers.common['Authorization'] = `bearer ${token}`;
    try{
        const data = await axios.post("http://localhost:4000/discover/podcast/ban/notban",{
            podcast_id : podcast_id
        },{
            headers:{
                "content-type" : "application/json"
            }
        })
        return res.json(data.data);
    }catch(e){
        return res.json({
            error : true,
            message : e.message
        })
    }
})
module.exports = route;