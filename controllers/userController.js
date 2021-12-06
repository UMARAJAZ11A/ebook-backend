// const User = require('../models/users');
const catchAsyncErrors = require('../middlewares/catchAsyncError');
const ErrorHandler = require('../utils/errorHandler');
const sendToken = require('../utils/jwtToken');
const fs = require('fs');
// const APIFilters = require('../utils/apiFilters');
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

//Get current user profile => /me
exports.getUserProfile = catchAsyncErrors( async(req,res,next) => {

    const id = req.user.id ;
    console.log(id);
    const result =  await getQuery( `select id,firstName,lastName,gender,dateOfBirth,role from users where id=?` , id );
    const email =   await getQuery(`select email from auth where id=?` , id) ;

    //  result[0].data.email = email[0].data.email ;
    const data = {
        id : result[0].id ,
        firstName : result[0].firstName ,
        lastName : result[0].lastName ,
        gender : result[0].gender ,
        dateOfBirth : result[0].dateOfBirth ,
        role : result[0].role ,
        email : email[0].email ,
    }
    
    res.status(200).send({
        success : true ,
        data : data
    })

} )



//Get current user saved/liked bookid => /me/books
exports.getUserBooks = catchAsyncErrors( async(req,res,next) => {

    const id = req.user.id ;
    const key = req.query.key ;
    
    const result = await getQuery( `select ${key} from users where id=?` , id );
    
    let data ;
    if(key == `saved`)
    {
        data = {
            saved : result[0].saved 
        }
    }
    else
    {
        data = {
            liked : result[0].liked 
        }
    }
    console.log(result[0]);
    res.status(200).send({
        success : true ,
        data : data
    })

} )



//Check if book is liked/saved by user or not => me/favourite
exports.isLikedSaved = catchAsyncErrors( async(req,res,next) => {

    const id = req.user.id ;
    const bookId = req.query.id ;
    try {
        
        const result = await getQuery( `select liked,saved from users where id=?` , id );
       
        const likedList = (Object.values(result[0])[0]) == null ? '' :  (Object.values(result[0])[0]).split(",");
        const savedList = (Object.values(result[0])[1]) == null ? '' :  (Object.values(result[0])[1]).split(",");
        
        
        const liked = likedList.indexOf(bookId) === -1 ? false : true;
        const saved = savedList.indexOf(bookId) === -1 ? false : true;
        
        const data = {
            liked : liked ,
            saved : saved 
        } 
        
        
        res.status(200).send({
            success : true ,
            data : data
        })
    } catch (error) {
        res.status(400).send({
            success : false ,
            message : error
        })
    }

} )



//Set current user saved/liked bookid => /me/books
exports.setUserBooks = catchAsyncErrors( async(req,res,next) => {

    const userId = req.user.id ;
    const bookId = req.body.bookId ;
    const key = req.body.key ;
    const value = req.body.value ;
    
    let select;
    if(value === 'add'){
        
         
         select = `update users set ${key}=
                   IF(${key} is not null,CONCAT(${key},',', ${bookId}), ${bookId})
                    where id=?`;
                    try {
                        await getQuery(select , userId) ;
                        res.status(200).send({
                            success : true ,
                            message : `Book ${key} Successfully!` 
                        })
                        
                    } catch (error) {
                        console.log(error)
                        res.status(200).send({
                            success : false ,
                            data : error
                        })
                    }
    }
    else
    {
         
        try {
            
            select =  `select ${key} from users where id=?`;
            let result = await getQuery(select , userId) ;

                let BookList = (Object.values(result[0])[0]).split(",");
                BookList.splice(BookList.indexOf(bookId),1);
                let val = BookList.toString().length ===0 ? null : BookList.toString();

            select = `update users set ${key}=? where id=?`;
            await getQuery(select ,[val,userId] )

            res.status(200).send({
                success : true ,
                message : `Book removed from your ${key}  Successfully!` 
            })



        } catch (error) {
            console.log(error)
            res.status(200).send({
                success : false ,
                data : error
            })
        }      
 
    }

} )

// //Update current user password => /password/update
// exports.updatePassword = catchAsyncErrors( async(req,res,next) => {

//     const user = await User.findById(req.user.id).select('+password');

//     //Check previous user password
//     const isMatched = await user.comparePassword(req.body.currentPassword);
//     if(!isMatched){
//         return next(new ErrorHandler('old Password is incorrect', 401));
//     }

//     user.password = req.body.newPassword;
//     await user.save();

//     sendToken(user , 200 , res);


    

// } )


//Update current user profile => /me/update
exports.updateUser = catchAsyncErrors( async(req,res,next) => {

    
     const   firstName = req.body.firstName ? req.body.firstName : null ;
     const   lastName = req.body.lastName ? req.body.lastName : null ;
    //     lastName : req.body.lastName 
     const    email =  req.body.email ? req.body.email : null  ;
    

    const id = req.user.id ;
    console.log(id , firstName , " id");
    try {

        if(firstName||lastName)
        {
            let select =    `update users set  firstName =if(? is null , firstName ,  ? )  ,
                            lastName =if(? is null , lastName ,  ? ) 
                            where id=${id}`;
            await getQuery( select , [firstName , firstName , lastName , lastName] ) ;
        }

        if(email)
        {
            let select = `update auth  set email=? where id =${id}`;
            await getQuery(select , email) ;
            

        }
        res.status(200).send({
            success : true ,
            message : 'Your Profile is upate Successfully!'
        })

    } catch (error) {
        
        res.status(200).send({
            success : false ,
            message : error 
        })

    }


    
} )









//Delete current user profile => /me/delete
exports.deleteUser = catchAsyncErrors( async(req,res,next) => {

    console.log(req.user.id);
    const id = req.user.id ;

    let select = `delete from users where id=?` ;
    
    try {
        
        await getQuery( select , id ) ;

        select = `delete from userlogindata where id=?` ;

        await getQuery( select , id ) ;

        select = `delete from usersavedlikedbooks where id=?` ;

        await getQuery( select , id ) ;

        res.status(200).send({
            success : true ,
            message : 'Your account has been deleted Successfully!'
        })


    } catch (error) {

        res.status(200).send({
            success : false ,
            message : error
        })
        
    }

    // const user = await User.findByIdAndDelete(req.user.id)

    // res.cookie('token' , 'none',{
    //     expires : new Date(Date.now()),
    //     httpOnly : true
    // });
    // res.status(200).send({
    //     success : true ,
    //     data : 'Your account has been deleted'
    // })

    
} )


// //Adding controller methods that only accassable by admin


// //show all user => /users
// exports.getUser = catchAsyncErrors( async(req,res,next) => {

//     const apiFilters = new APIFilters(user.find() , req.query)
//     .filter()
//     .sort()
//     .limitFields()
//     .pagination()

//     const users = await apiFilters.query ;
//     res.status(200).send({
//         success : true ,
//         result : users.length ,
//         data : users
//     })

    
// } )



// // Delete user method only accessable by admin  => /user/:id
// exports.deleteUserAdmin = catchAsyncErrors( async(req,res,next) => {

//     const user = await User.findById(req.params.id);


//     if(!user)
//     {
//         return next(new ErrorHandler(`user not found with id : ${req.params.id}`, 404));
//     }

//     deleteUserData(user.id , user.role);

//     await user.remove();

//     res.status(200).send({
//         success : true ,
//         message : 'user is deleted by admin'
//     })

    
// } )




// async function deleteUserData(user , role){



//     if(role === 'employeer')
//     {
//         await Job.deleteMany({ user : user });
//     }
//     if(role === 'user')
//     {
//         const appliedJobs = await Job.find({'applicantsApplied.id': user})
//                                         .select('+applicantsApplied');

//         for(let i=0;i<appliedJobs.length;i++)
//         {
//             let obj = appliedJobs[i].applicantsApplied.find( o => o.id === user );

//             console.log(_dirname);

//             let filepath = `${_dirname}/public/uploads/${obj.resume}`.replace('||controllers','');

//             fs.unlink( filepath , err => {
//                 if(err){
//                     return console.log(err);
//                 }
//             });

//             appliedJobs[i].applicantsApplied.splice(appliedJobs[i].
//                         applicantsApplied.indexOf(obj.id));

            
//                         await appliedJobs[i].save();

//         }
//     }

// }


