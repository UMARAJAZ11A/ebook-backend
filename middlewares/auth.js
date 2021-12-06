const jwt = require('jsonwebtoken');


const catchAsyncErrors = require('../middlewares/catchAsyncError');
const ErrorHandler = require('../utils/errorHandler');
const pool = require('../sql');
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



// Check if the user is authenticated or not

exports.isAuthenticatedUser = catchAsyncErrors(  async ( req, res , next) => {

    let token ;

    if(req.headers.authorization && req.headers.authorization.startsWith('token') )
    {
        token = req.headers.authorization.split(' ')[1];

    }
    if(!token){

        console.log(`Unauthentuicated user trying Access this resource..`) ;
        return next(new ErrorHandler('Login first to access this resource', 401));
    }
    
    const decoded = jwt.verify(token  , process.env.JWT_SECRET   );
    
    try {
        const user = await getQuery( `select * from users where id=?` , decoded.id ) ;

        console.log(`User Authorized Successfully!`) ;
    
        req.user = user[0];
        
        next();
        
    } catch (error) {

        console.log(`Unauthentuicated user trying Access this resource : User Not Found in Database`) ;
        return next(new ErrorHandler('Login first to access this resource', 401));
        
    }

}
)