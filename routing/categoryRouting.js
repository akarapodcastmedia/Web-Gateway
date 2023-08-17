const express = require("express");
const route   = express.Router();
const db  = require('../db/mongoConfig');
const jsonwebtoken = require("jsonwebtoken");
const axios = require("axios");
const FormData = require('form-data');
const {TokenValidator} = require('../middleware/middlware');
const redis = require("redis");
const redisClient = redis.createClient({
    url : 'redis://cache.akarahub.tech:6379'
});
(async()=> await redisClient.connect())();
redisClient.on('ready',()=> console.log("==>>> connect to cache successfully"));
redisClient.on('error',(err)=>console.log("error during connecting to redis server ..."));
db();

// ==================================================
// CREATE CATEGORY
//===================================================
route.post('/create',TokenValidator,async(req,res)=>{
    const category = req.body.categoryType;
    const token = jsonwebtoken.sign({user:req.session.user,role:req.session.role,email:req.session.email},process.env.PROGRAM_TOKEN_SECRET,{expiresIn : '5min'});
    axios.defaults.headers.common['Authorization'] = `bearer ${token}`;
    try{
        const data = await axios.post("http://localhost:4000/discover/category/createcategory",{
            data : {
                category : category
            }
        },{
            headers : {
                "content-type" : "application/json"
            }
        });
        //console.log(data.data);
        return res.json(data.data);
    }catch(e){
        return res.json({
            error : true,
            message : e.message
        })
    }
   
});

// ===================================================
// LIST ALL CATEGORY
//====================================================
route.get('/list/all',TokenValidator,async(req,res)=>{
    const cache = await redisClient.get("category");
    if(cache){
        return res.json({
            error : false,
            message : "request success by cache",
            data : JSON.parse(cache)
        });
    }else{
        const token = jsonwebtoken.sign({user:req.session.user,role:req.session.role,email:req.session.email},process.env.PROGRAM_TOKEN_SECRET,{expiresIn : '5min'});
        axios.defaults.headers.common['Authorization'] = `bearer ${token}`;
        const data = await axios.get("http://localhost:4000/discover/category/list/all/categorylistall");
        return res.json(data.data);
    }
   
});

// ====================================================
// LIST PODCAST BY CATEGORY 
//=====================================================
route.post('/list/category/podcast',async(req,res)=>{
    const categoryType = req.body.categoryType;
    const token = jsonwebtoken.sign({user:req.session.user,role:req.session.role,email:req.session.email},process.env.PROGRAM_TOKEN_SECRET,{expiresIn : '5min'});
        axios.defaults.headers.common['Authorization'] = `bearer ${token}`;
        try{
            const data = await axios.post("http://localhost:4000/discover/category/list/podcastincategory",{    
            categoryName : categoryType
        },{
            headers : {
                "content-type" : "application/json"
            }
        });
    return res.json(data.data);
        }catch(e){
            return res.json({
                error : true,
                message : e.message
            })
        }
       
})
//========================================
// UPDATE CATEGORY
//=======================================
route.post('/update/category',async(req,res)=>{
    const category_id = req.body.category_id;
    const category_name = req.body.category_name;
    const token = jsonwebtoken.sign({user:req.session.user,role:req.session.role,email:req.session.email},process.env.PROGRAM_TOKEN_SECRET,{expiresIn : '5min'});
    axios.defaults.headers.common['Authorization'] = `bearer ${token}`;
    const data = await axios.post("http://localhost:4000/discover/category/updatecategory",
     { 
        category_id: category_id ,
        category_name : category_name
     }
    , 
    {
        headers : {
            "content-Type": "application/json",
        } 
    })
    // response to the end user
    return res.json(data.data);
})

//===========================================
// DELETE CATEGORY 
//===========================================
route.post("/delete/category",async(req,res)=>{
    const category_id = req.body.category_id;
    const token = jsonwebtoken.sign({user:req.session.user,role:req.session.role,email:req.session.email},process.env.PROGRAM_TOKEN_SECRET,{expiresIn : '5min'});
    axios.defaults.headers.common['Authorization'] = `bearer ${token}`;
    const data = await axios.post("http://localhost:4000/discover/category/deletecategory",
     { 
        category_id: category_id
    }
    , 
    {
        headers : {
            "content-Type": "application/json",
        } 
    });
    return res.json(data.data);
})
module.exports = route;