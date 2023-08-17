require("dotenv").config();
const jwt = require("jsonwebtoken");

const TokenValidator = async(req,res,next)=>{
    console.log(req.session);
    // check token input 
    const token = req.header("Authorization");
    console.log(token);
    if(token){
        // check if the token in the format of bearer 
        try{
            // check if it is actually bearer token 
            const bearer = token.split(" ")[0];
            console.log(bearer);
            if(bearer=="bearer"){
                // get token 
                const access = token.split(" ")[1];
                jwt.verify(access,process.env.PROGRAM_TOKEN_SECRET,(error,user)=>{
                    if(error){
                        return res.json({
                            error : true,
                            message : error.message
                        })
                    }else{
                        const sess = req.session;
                        //console.log(sess);
                        try{
                            if(sess.role != null){
                                const role = sess.role;
                                if(role == "podcaster" || role == "admin"){
                                    req.email = sess.email;
                                    req.role  = sess.role;
                                    req.username=sess.username;
                                    req.identify = user.identify
                                    next();
                                }else{
                                    return res.json({
                                        error : true ,
                                        message :"Your role is not allowed"
                                    })
                                }
                            }else{
                                return res.json({
                                    error : true ,
                                    message : "You are not allowed , please login"
                                })
                            }
                        }catch(e){
                            return res.json({
                                error : true,
                                message : e.message
                            })
                        }
                        
                    }
                })
            }else{
                return res.json({
                    error : true,
                    message : "require bearer token format"
                })
            }
        }catch(e){
            return res.json({
                error : true,
                message : e.message
            })
        }
    }else{
        return res.json({
            error : true,
            message : "require token ..."
        })
    }
}
module.exports =  {
    TokenValidator
}