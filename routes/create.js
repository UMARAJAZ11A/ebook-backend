const router = require('express').Router();
const pool = require('../sql');

// async function sqlQuery(select , values )
// {
//      let output ;
//      await pool.query(select , values , (err , result ) => {
//           if(err){
//                          console.log(`${err}`) ;
//                          output = {
//                               status : 400 ,
//                               result : err
//                          }
                         
//                          return {
//                               status : 400 ,
//                               result : err
//                          };
//                }
//                else
//                {
//                          console.log(`successfuly completed`)
//                          output = {
//                               status : 200 ,
//                               result : result
//                          }
                         
//                          return {
//                               status : 200 ,
//                               result : result
//                          };

//                }
//           });
          
//            console.log(output);
//           return 'sdf'
// }

router.route('/create/:id').post((req,res) => {
     
     const bookId = String(req.params.id) ;
     const userId = Number(req.body.userId);
     const key = req.body.key ;
     const value = req.body.value ;
     console.log(bookId)
     let select;
     if(value === true){
          // console.log(value)
          select = `update usersavedlikedbooks set ${key}BookIds=
                    IF(${key}BookIds!='',CONCAT(${key}BookIds,',', ${bookId}), ${bookId})
                     where id=?`;
                     pool.query(select , userId , (err , result ) => {
                         if(err){
                              console.log(`${err}`) 
                              res.status(400).send(`Error : ${err}`)
                         }
                         else
                         {
                              console.log(`successfuly completed`);
                              res.send(`successfuly completed`);
                         }
                    });
     }
     else
     {
          
         select =  `select ${key}BookIds from usersavedlikedbooks where id=?`;      
         pool.query(select , userId , (err , result ) => {
          if(err){
                    console.log(err)
                    res.status(400).send(`Error couldn't get the user from database : 
                                   ${err} `);
               }
               else
               {
                    let BookList = (Object.values(result[0])[0]).split(",");
                     BookList.splice(BookList.indexOf(bookId),1);
                     let val = BookList.toString();
                    // console.log(BookList)
                    select = `update usersavedlikedbooks set ${key}BookIds=? where id=?`;
                    pool.query(select , [val,userId] , (err , result ) => {
                         if(err){
                              console.log(`${err}`) 
                              res.status(400).send(`Error : ${err}`)
                         }
                         else
                         {
                              console.log(`successfuly completed`);
                              res.send(`successfuly completed`);
                         }
                    });

               }
          })  
     }
         


})
router.route('/create/').post((req,res) => {
    
     const user = req.body ;

     let select = `insert into users (id,firstName,lastName,gender,dateOfBirth) 
                         values(?,?,?,?,?)`;

     const values = [
                         user.id              , 
                         user.firstName       ,
                         user.lastName        ,
                         user.gender          ,
                         user.dateOfBirth     
                    ]
     pool.query(select,values , (err, result) => {
               if(err){
                    console.log(`Error couldn't Upload data on sql database : 
                    ${err} `)
                    res.status(400).send(`Error couldn't Upload data on sql database : 
                                   ${err} `);
               }
               else
               {
                    select = `insert into userlogindata (id,email,password) 
                              values(?,?,?)`;
                    pool.query(select,[user.id,user.email,user.password] , (err, result) => {
                         if(err){
                              res.status(400).send(`Error couldn't Upload data on sql database : 
                                             ${err} `);
                         }
                         else
                         {
                              console.log('User Added Successfully!')
                              // res.send('User Added Successfully!');
                         }
                    })
                    select = `insert into usersavedlikedbooks (id,likedBookIds,savedBookIds) 
                              values(?,?,?)`;
                    pool.query(select,[user.id,'',''] , (err, result) => {
                         if(err){
                              res.status(400).send(`Error couldn't Upload data on sql database : 
                                             ${err} `);
                         }
                         else
                         {
                              console.log('User Added Successfully!')
                              res.send('User Added Successfully!');
                         }
                    })
                    
               }

          })
     

});

router.route('/create/').get((req,res) => {
     const id = Number(req.query.id);
     const email = req.query.email
      //console.log(id)
     let select ;
     if(id)
     {
           select = `select firstName,lastName,gender,dateOfBirth from users where id=${id}`;
     }
     else
     {
          select = `select id from userlogindata where email=${email}`
     }
     
     pool.query(select , ( err , result ) => {
          if(err){
               res.status(400).send(`Error couldn't get the user from database : 
                              ${err} `);
          }
          else
          {
               // console.log('User Fetched successfully!')
               // console.log(result)
               res.send(result);
          }
     })
})


router.route('/create/:id').get((req,res) => {
     
     const userId = req.params.id ;
     const key = req.query.key ;

     const select= `select ${key}BookIds from usersavedlikedbooks where id=?`

     pool.query(select , userId ,( err , result ) => {
          if(err){
               console.log(err)
               res.status(400).send(`Error couldn't get the user from database : 
                              ${err} `);
          }
          else
          {
               // console.log('User Fetched successfully!')
               console.log(result)
               res.send(result);
          }
     })
})


module.exports = router;