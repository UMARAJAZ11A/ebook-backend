const router = require('express').Router();

const { getUserProfile ,
        deleteUser ,
        updateUser ,
        getUserBooks ,
        setUserBooks ,
        isLikedSaved } = require('../controllers/userController');

const { isAuthenticatedUser   } = require('../middlewares/auth');

//get user profile
router.route('/me').get(isAuthenticatedUser , getUserProfile );

//delete user
router.route('/me/delete').delete(isAuthenticatedUser , deleteUser );

//update user
router.route('/me/update').put(isAuthenticatedUser , updateUser );


//Get user liked/saved books id
router.route('/me/books').get(isAuthenticatedUser , getUserBooks );


//Set user liked/saved books id
router.route('/me/books').put(isAuthenticatedUser , setUserBooks );


//Check if book is liked/saved by user or not
router.route('/me/favourite').get(isAuthenticatedUser , isLikedSaved );

// router.route('/users').get(isAuthenticatedUser,
// authorizeRoles('admin') , getUser);     

// router.route('/user/:id').delete(isAuthenticatedUser,
// authorizeRoles('admin') , deleteUserAdmin);   

module.exports = router;