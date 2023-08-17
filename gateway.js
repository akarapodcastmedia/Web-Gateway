
// ================================|| ___________ WEB GATEWAY BECKEND FOR FRONT END ___________||=========================
//****************************************************************************************************************** */
// | PURPOSE : acting as a gateway to serve core functionality for others services of AKARA PODCST
// | PROJECT : praticum
// | START AT DATE : 
// | FINISH AT DATE: 
// | LEADED BY : MR.KOR SOKCHEA
// | TEAM COLABORATORS :  -> TAN BUNCHHAY -> NUT VIRAK -> POK HENGLY -> PICH LYHEANG
// | API DESIGNER : MR. PICH LYHEANG
//******************************************************************************************************************* */

// PROJECT START IMPLEMENTING

//==================================================
// ALLOW ENV VERIABLE FILE AVAILABLE
//==================================================
require("dotenv").config();
const express = require("express");
const gateway = express();
const cookieParser = require("cookie-parser");
gateway.use(express.json());
gateway.use(express.urlencoded({extended : true}));
const cors = require("cors");
gateway.set("trust proxy",1);
gateway.use(cors({
    origin : [process.env.cors_url],
    methods : ["GET","POST","PUT","DELETE"],
    credentials : true
}));
const helmet  = require("helmet");
const rateLimit = require("express-rate-limit");
const { default: axios } = require("axios");
gateway.use(cookieParser());
const redis = require("redis");
const session = require("express-session");
const  RedisStore  = require("connect-redis").default;
const redisClient = redis.createClient({
    url : 'redis://cache.akarahub.tech:6379'
});
 (async()=> await redisClient.connect())();
redisClient.on('ready',()=> console.log("connect to redis success"));
redisClient.on('error',(err)=>console.log("error during connecting to redis server ..."));
gateway.use(session({
    name: 'akarapodcast',
    resave : false,
    secret : "welcome to akara",
    saveUninitialized : false,
    store : new RedisStore({
        client : redisClient,
        prefix : "akara:"
    }),
    cookie : {
    secure: true,
	sameSite: "none",
    maxAge : 1000*60*60*24    
    }
}));
//==================================================
// ASSIGN PORT 
//==================================================
const PORT = 10000 || process.env.PORT;
//  =================================================
//  GATEWAY MIDDLEWARES
// ==================================================
gateway.use(helmet());
gateway.use(rateLimit({
    windowMs : 15 * 60 * 1000,
    max : 100
}));
const router = require('./routing/podcastRouting');
const router2= require('./routing/categoryRouting');
const router3= require('./routing/podcaster');
//============================================
// ROUTE MANIPULATION SECTION 
//============================================
gateway.use("/web/gateway",router);
gateway.use("/web/gateway/category",router2);
gateway.use("/web/gateway/podcaster",router3);

//============================================
// FORWARDING INBOUNDED REQUESTS TO AKARA MICROSERVICES
//===========================================
//============================================\
//      SERVER PORT OF THIS BFF 
//\============================================/
gateway.listen(PORT,()=>console.log("BFF WEB GATEWAY IS BEING LISTENED ON PORT  : 10000"));




//                   //======================================\\
//                   ||       END OF BFF IMLEMENTATION       ||
//                   \\======================================//