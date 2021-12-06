const router = require('express').Router();

const { registerUser , 
        loginUser , 
        logout , 
        authenticateUser, 
        forgotPassword,
        resetPassword} = require('../controllers/authController');

const { isAuthenticatedUser } = require('../middlewares/auth')

router.route('/register').post( registerUser );

router.route('/auth').get( isAuthenticatedUser , authenticateUser );

router.route('/login').post(loginUser);

router.route('/logout').get( isAuthenticatedUser , logout );




//API to send password recovery link to email
router.route('/forgot').get(forgotPassword);


//Reset Password
router.route('/password/reset/:token').get(resetPassword);

module.exports = router;