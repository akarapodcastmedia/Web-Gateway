const express = require("express");
const route   = express.Router();
const db  = require('../db/mongoConfig');
const jsonwebtoken = require("jsonwebtoken");
const axios = require("axios");
const FormData = require('form-data');
const {TokenValidator} = require('../middleware/middlware');
const redis = require("redis");
const multer  = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const redisClient = redis.createClient({
    url : 'redis://cache.akarahub.tech:6379'
});
(async()=> await redisClient.connect())();
redisClient.on('ready',()=> console.log("connect to cache successfully"));
redisClient.on('error',(err)=>console.log("error during connecting to redis server ..."));
db();
//======================================
// upload profile 
//======================================
route.post('/upload/profile',TokenValidator,upload.single("profile"),async(req,res)=>{
    // generate a token 
     const token = jsonwebtoken.sign({username : req.session.username,user:req.session.user,role:req.session.role,email:req.session.email,identify:req.identify},process.env.PROGRAM_TOKEN_SECRET,{expiresIn : '5min'});
     const my_file = new FormData();
     my_file.append("profile",req.file.buffer,{filename : req.file.fieldname});
     my_file.append("file_type",req.file.mimetype);
     my_file.append("file_size",req.file.size);
     axios.defaults.headers.common['Authorization'] = `bearer ${token}`;
     try{
         const data = await axios.post("https://dev.akarahub.tech/discover/podcaster/upload/profile",
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
})
//======================================
// update profile 
//======================================
route.post('/update/profile',TokenValidator,upload.single("profile"),async(req,res)=>{
    // generate a token 
     const token = jsonwebtoken.sign({username : req.session.username,user:req.session.user,role:req.session.role,email:req.session.email,identify:req.identify},process.env.PROGRAM_TOKEN_SECRET,{expiresIn : '5min'});
     const my_file = new FormData();
     my_file.append("profile",req.file.buffer,{filename : req.file.fieldname});
     my_file.append("file_type",req.file.mimetype);
     my_file.append("file_size",req.file.size);
     axios.defaults.headers.common['Authorization'] = `bearer ${token}`;
     try{
         const data = await axios.post("http://dev.akarahub.tech/discover/podcaster/update/profile",
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
})
//=======================================
// LIST ALL PODCASTER OF AKARA 
//======================================
route.get('/list/all/podcaster',TokenValidator,async(req,res)=>{
    const token = jsonwebtoken.sign({user:req.session.user,role:req.session.role,email:req.session.email},process.env.PROGRAM_TOKEN_SECRET,{expiresIn : '5min'});
    axios.defaults.headers.common['Authorization'] = `bearer ${token}`;
    try{
        const result = await axios.get("http://localhost:4000/discover/podcaster/list/all/listallpodcaster",
        {
            headers : {
                "content-type" : "application/json"
            }
        }
        );
        return res.json(result.data);
    }catch(e){
        return res.json({
            error : true,
            message : e.message
        })
    }
   
})
//================================================
// LIST PODCAST OF PODCASTER
//=================================================
route.post('/list/podcaster/podcast',TokenValidator,async(req,res)=>{
    const podcaster_id = req.body.podcaster_id;
    console.log(podcaster_id);
    const token = jsonwebtoken.sign({user:req.session.user,role:req.session.role,email:req.session.email},process.env.PROGRAM_TOKEN_SECRET,{expiresIn : '5min'});
    axios.defaults.headers.common['Authorization'] = `bearer ${token}`;
    //make the axios request
    try{
        
        const result = await axios.post("http://localhost:4000/discover/podcaster/list/podcaster/podcastofpodcaster",{
                id : podcaster_id  
        },{
            headers : {
                "content-type" : "application/json"
            }
        });
    // if data get success 
    return res.json(result.data)
    }catch(e){
        return res.json({
            error : true,
            message : e.message
    })
    }   
});
//=========================================
// BAN PODCASTER 
//=========================================
route.post('/ban/podcaster',TokenValidator,async(req,res)=>{
    const podcaster_id = req.body.podcaster_id;
    const token = jsonwebtoken.sign({user:req.session.user,role:req.session.role,email:req.session.email},process.env.PROGRAM_TOKEN_SECRET,{expiresIn : '5min'});
    axios.defaults.headers.common['Authorization'] = `bearer ${token}`;
    //make the axios request
    try{
        const result = await axios.post("http://localhost:4000/discover/podcaster/ban/banpodcaster",{
                podcaster_id : podcaster_id  
        },{
            headers : {
                "content-type" : "application/json"
            }
        });
    // if data get success 
    return res.json(result.data)
    }catch(e){
        return res.json({
            error : true,
            message : e.message
        })
    } 
});

//============================================
// DISBAN PODCASTER 
//============================================
route.post('/disban/podcaster',TokenValidator,async(req,res)=>{
    const podcaster_id = req.body.podcaster_id;
    const token = jsonwebtoken.sign({user:req.session.user,role:req.session.role,email:req.session.email},process.env.PROGRAM_TOKEN_SECRET,{expiresIn : '5min'});
    axios.defaults.headers.common['Authorization'] = `bearer ${token}`;
    //make the axios request
    try{
        
        const result = await axios.post("http://localhost:4000/discover/podcaster/ban/podcaster/unbanpodcaster",{
                podcaster_id : podcaster_id  
        },{
            headers : {
                "content-type" : "application/json"
            }
        });
    // if data get success 
    return res.json(result.data)
    }catch(e){
        return res.json({
            error : true,
            message : e.message
        })
    } 
});

//=========================================
// DELETE PODCASTER 
//=========================================
route.post('/delete/podcaster',TokenValidator,async(req,res)=>{
    const podcaster_id = req.body.podcaster_id;
    console.log(podcaster_id)
    const token = jsonwebtoken.sign({user:req.session.user,role:req.session.role,email:req.session.email},process.env.PROGRAM_TOKEN_SECRET,{expiresIn : '5min'});
    axios.defaults.headers.common['Authorization'] = `bearer ${token}`;
    //make the axios request
    try{
        
        const result = await axios.post("http://localhost:4000/discover/podcaster/delete/deletepodcaster",{
             podcaster_id : podcaster_id  
        },{
            headers : {
                "content-type" : "application/json"
            }
        });
    // if data get success 
    return res.json(result.data);
    }catch(e){
        return res.json({
            error : true,
            message : e.message
        })
    };
});

module.exports = route;