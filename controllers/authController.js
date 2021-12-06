// const User = require('../models/users');
const catchAsyncErrors = require('../middlewares/catchAsyncError');
const ErrorHandler = require('../utils/errorHandler');
const jwt = require('jsonwebtoken');

const {sendToken , getJwtToken} = require('../utils/jwtToken');
// const sendEmail = require('../utils/sendEmail');
// const crypto = require('crypto');
const pool = require('../sql');
const sendEmail = require('../utils/sendEmail');
const getQuery = async ( select , values ) => {

    return new Promise((resolve, reject)=>{
        pool.query(select , values ,  (error, results)=>{
            if(error){
                return reject(error);
            }
            return resolve(results);
        });
    });

}

// Register a new user => /register
exports.registerUser =catchAsyncErrors( async (req,res,next) => {

    // const {name , email , password , role} = req.body ;

    // const user = await User.create({
    //     name ,
    //     email ,
    //     password ,
    //     role
    // });

    
    // res.status(200).send({
    //     success : true ,
    //     message : 'User is Registered',
    //     data : User ,
    //     token 
    // })
    
    
    const user = req.body ;
    
    let select = `insert into users (id,firstName,lastName,gender,dateOfBirth,role,liked,saved) 
    values(?,?,?,?,?,?,?,?)`;
    
    const values = [
        user.id              , 
        user.firstName       ,
        user.lastName        ,
        user.gender          ,
        user.dateOfBirth     ,
        'user'               ,
        null                 ,
        null                
    ]
    try {
        
        await getQuery( select , values ) ;
        console.log('User Data added Successfully!');
        
        select = `insert into auth (id,email,password) 
        values(?,?,?)`;
        
        await getQuery( select , [user.id,user.email,user.password] ) ;
        console.log('User Email/Password Registered Successfully!');
        
        
        //Create JWT Token
        const token = sendToken(user , 200 , res);

        res.status(200).send({
            success : true ,
            message : 'User Registered Successfully!',
            token
        })
        
        
    } 
    catch (error) {
        res.status(400).send({
            success : false ,
            message : error,
            })
        }
         

})


//Login user => /login

exports.loginUser =catchAsyncErrors( async (req,res,next) => {

    const { email , password } = req.body ;
    console.log(email);
    //Check email password is entered or not by user
    if(!email || !password)
    {
        return next(new ErrorHandler('Please enter the email & password') , 400);
    }

    //Finding the user in the databse
    const select = 'select * from auth where email =? && password = ?';
    const user = await getQuery(select , [ email , password ]);
    console.log(user);
    if(user.length === 0){
        return next(new ErrorHandler('Envalid email or password') , 401);
    }

    // Create json web token
    sendToken(user[0] , 200 , res );

} )



//authenticate user => /auth

exports.authenticateUser =catchAsyncErrors( async (req,res,next) => {

    if(req.user)
    {
        res.status(200).send({
            success : true ,
            message : 'User Authenticated Successfully!'
        })
    }

} )


// // Forgot Password => /password/forgot
// exports.forgotPassword = catchAsyncErrors( async( req, res , next ) => {

//     const user = await User.findOne({  email : req.body.email });

//     // Check user email in data base
//     if(!user){
        
//         return next(new ErrorHandler('No user found with this email') , 404);
//     }

//     // Get reset token
//     const resetToken = user.getResetPasswordToken();

//     await user.save({  validateBeforeSave : false });

//     //Create reset password url
//     const resetUrl = `${req.protocol}://${req.get('host')}/password/reset/${resetToken}`;

//     const message = `Your password reset link as follows:\n\n\n\n
//                     ${resetUrl}\n\n\n\n
//                     If you have not requested this then ignore this email`;

    
//     try {
        
//         await sendEmail({
//             email : user.email ,
//             subject : 'API Password Recovery Email',
//             message
//         })
    
//         res.status(200).send({
//             success : true ,
//             message : `Email send successfully to : ${user.email}`
//         })
//     } catch (error) {
        
//         user.resetPasswordToken = undefined ;
//         user.resetPasswordExpire = undefined ;

//         await user.save({ validateBeforeSavebeforeSave : false });

//         return next(new ErrorHandler('Email Not Sent!') , 500);
//     }



// });


// // Reset Password => /password/reset/:token
// exports.resetPassword = catchAsyncErrors(  async (req,res,next) => {

//     //Hash url token
//     const resetPasswordToken = crypto.createHash('sha256')
//                                     .update(req.params.token)
//                                     .digest('hex');
    
//     const user = await User.findOne({ 
//                     resetPasswordToken ,
//                     resetPasswordExpire : {$gt : Date.now() } });

//     if(!user){

//         return next(new ErrorHandler('Password reset token is invalid or Expired',400));
//     }

//     //Setup new Password 
//     user.password = req.body.password ;
//     user.resetPasswordToken = undefined ;
//     user.resetPasswordExpire = undefined ;
    
//     await user.save();

//     sendToken(user , 200 , res);


// });


//Logout user => /logout

exports.logout = catchAsyncErrors(  async (req,res,next) => {

    res.status(200)
    .cookie('token','none', {
        expires : new Date(Date.now()),
        httpOnly : true
    }).send({
        success : true ,
        message : `Logged out successfully`
    })


  
});






// Forgot Password => /forgot/
exports.forgotPassword =catchAsyncErrors( async (req,res,next) => {

    const email = req.body.email ;

    if(!email)
    {
        res.status(400).send(`No User Found with this email`);
    }
    const select = `select id from auth where email=?` ;
    
    const user = await getQuery(select , email) ;
    
    if(!user[0].id)
    {
        res.status(400).send(`No User Found with this email`);
    }
    
    // Get reset Token
    const resetToken = getJwtToken(user[0].id);
    
    
    //send email with token 
    //Create reset password url
    const resetUrl = `${req.protocol}://${req.get('host')}/password/reset/${resetToken}`;
    
    const message = `Your password reset link as follows:\n\n\n\n
    ${resetUrl}\n\n\n\n
    If you have not requested this then ignore this email`;
    
    // console.log(user[0].id , resetUrl)
    
    try {
        
        await sendEmail(
             email ,
             'API Password Recovery Email',
             message
        )
    
        res.status(200).send({
            success : true ,
            message : `Email send successfully to : ${email}`
        })
    } catch (error) {
        
        res.status(400).send('Email Not Send')
    }



});


// Rest Password => /password/reset/:token
exports.resetPassword = catchAsyncErrors ( async (req,res,next) => {

    const token = req.params.token ;
    // console.log(token)
    const decoded = jwt.verify(token  , process.env.JWT_SECRET   );
    
    try {
        await getQuery( `select * from users where id=?` , decoded.id ) ;

        console.log(`Reset Token Authorized Successfully!`) ;
    
        res.status(200).send({
            success : true ,
            message : `Reset Token Authorized Successfully!` ,
        })
        
    } catch (error) {

        console.log(`Unauthentuicated user trying Access this resource : User Not Found in Database`) ;
        return next(new ErrorHandler('Login first to access this resource', 401));
        
    }

});
