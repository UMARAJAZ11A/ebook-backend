const router = require('express').Router();
const pool = require('../sql');


router.route('/login/').get((req,res) => {
  if(req.query)
  {
    const email = req.query.email;
    const password = req.query.password;
      const select = 'select * from userlogindata where email ='+ "'" + email+"'"+' && password ='+"'"+ password + "'";
      console.log(select);
      pool.query(select,(err,result) => {
        if(err)
        {
          console.log(err);
          res.send(err);
        }
        else
        {
          console.log(result);
          if(result.length!=0)
          return res.send(result);
          else
          return res.status(400).send({
            message: 'This is an error!'
         });
        }
      })
  }
  else
  {
    return res.status(400).send({
      message: 'This is an error!'
   });
    // const select = 'select * from user_login';
    // pool.query(select,(err,result) => {
    //     res.send(result);
    // })
  }
});


// router.route('/login/').post((req,res) => {
//         console.log(res.params);

//         const select = 'select * from user_login where email =='+req.body.email+'&& password =='+req.body.password;
//         pool.query(select,(err,result) => {
//           res.send(result);
//       })




// });



module.exports = router;