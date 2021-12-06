const router = require('express').Router();
const multer = require('../node_modules/multer');
const { Storage } = require('../node_modules/@google-cloud/storage');  //@google-cloud/storage

const { 
        getBookDetails ,
         
        deleteBook,
        getBooksByQuery,
        
        setBook,
        getBooksList} = require('../controllers/booksController');
const { isAuthenticatedUser } = require('../middlewares/auth');


//API to get Book By query
router.route('/books/').get( getBooksByQuery );


// API TO SEARCH BOOK WITH SEARCH PARAMETERS . 
// router.route('/book/').get( getBooks );


// Get List of all Category/Author/Name/Type => /books/list       // req.query
router.route('/book/list').get( getBooksList );



//API TO GET BOOK DEATILS/PDF_URL WITH SPECIFIC ID
router.route('/book/:id').get( getBookDetails );



//Multer is a middleware to add file to req object --> Read more
const uploader = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 100 * 1024 * 1024, // keep file size < 100 MB
    },
});
//API TO UPLOAD BOOK DETAILS ON LOCAL SQL DATABASE
// router.route('/book/').post( uploadBook );
router.route('/book/upload').post(isAuthenticatedUser , uploader.array('file') , setBook );


// API TO UPLOAD PDF AND IMAGE ON GOOGLE CLOUD
// router.route('/book/:id').post(uploader.array('file'), uploadPdfAndImg );



//API TO DELETE THE BOOK WITH SPECIFIC ID
router.route('/book/').delete( deleteBook );















module.exports = router;