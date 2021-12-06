// Create and send token and save in cookie
const jwt = require('jsonwebtoken');

const getJwtToken = function(id){

    return jwt.sign( { id : id } , process.env.JWT_SECRET , {
        expiresIn : process.env.JWT_EXPIRES_IN_TIME
    } )

}

const sendToken = ( user ,  statusCode , res ) => {

    //Create JWT token
    const  token =  getJwtToken(user.id);

    //Options for cookie
    const options = {
        
        expires : new Date(Date.now() + process.env.COOKIE_EXPIRES_TIME*24*60*60*1000 ),
        httpOnly : true ,
        
    //    secure : true
        
         
    };

    // if(process.env.NODE_ENV === 'production'){
    //     options.secure = true;
    // }.header('access-control-expose-headers: Set-Cookie')
    // res.setHeader('SameSite' , 'None');
    //  res.setHeader('access-control-expose-headers', 'Set-Cookie');
    //   res.setHeader('Access-Control-Allow-Origin', true);
    res.status(statusCode)
        .cookie('token' , token , options)
        .send({
            success : true ,
            token
        })

}

module.exports = {sendToken , getJwtToken}