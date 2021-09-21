const router = require('express').Router();
const pool = require('../sql');
const multer = require('../node_modules/multer');
const { Storage } = require('../node_modules/@google-cloud/storage');  //@google-cloud/storage


// API TO SEARCH BOOK WITH SEARCH PARAMETERS . 
router.route('/book/').get((req, res) => {
    
         const searchForColumn = req.query.searchForColumn ;
         const searchInColumn = req.query.searchInColumn ;
         const searchValue = req.query.searchValue ;
         let select ;
         select = `select ${searchForColumn} from booksdetail ${searchInColumn} ${searchValue}`
        pool.query(select, (err, result) => {
            if(err){
                console.log(err)
                res.status(400).send(`Error couldn't fi data in sql database : 
                            ${err} `);
            }
            else
            {
                res.send(result);
            }
        })
    
})



//API TO GET BOOK DEATILS/PDF_URL WITH SPECIFIC ID
router.route('/book/:id').get((req, res) => {

    const values = req.params.id;
    if(req.query.searchFor ==='book')
    {
        const select = 'select * from booksdetail where id=?';
        // console.log(req.query,"here book search")

        pool.query(select, values, (err, result) => {
            if(err){
                res.status(400).send(`Error couldn't get the data from sql database : 
                            ${err} `);
            }
            else if(result.length===0)
            {
                console.log(`No Book Found with id : ${values}`);
                res.status(400).send(`No Book Found with id : ${values}`);
            }
            else
            {
                res.send(result);
            }
        })
    }
    else
    {
        const select = 'select pdfUrl from booksdetail where id=?';
        // console.log(req.query,"here pdf search")
               
        pool.query(select, values, (err, result) => {
            if(err){
                res.status(400).send(`Error couldn't get the data from sql database : 
                            ${err} `);
            }
            else if(result.length===0)
            {
                console.log(`No PDF_URL Found with id : ${values}`);
                res.status(400).send(`No PDF_URL Found with id : ${values}`);
            }
            else
            {
                res.send(result);
            }
            
        })       
    }
})


//API TO UPLOAD BOOK DETAILS ON LOCAL SQL DATABASE

router.route('/book/').post((req, res) => {

    const select = 'insert into booksdetail values(?,?,?,?,?,?,?,?,?,?,?,?,?)';
    const values = [req.body.id, req.body.bookName,
    req.body.authorName, req.body.rating, req.body.category, 
    req.body.type,req.body.description, req.body.date, 200, 
    req.body.imgUrl,req.body.pdfUrl,req.body.imgName,req.body.pdfName]


    pool.query(select, values, (err, result) => {
        if(err){
            res.status(400).send(`Error couldn't upload data on sql database : 
                        ${err} `);
        }
        else
        {
            res.send(result);
        }
    })
})


// API Setup for Storage of file on google firebase 
        const storage = new Storage({
            projectId: process.env.GCLOUD_PROJECT_ID,
            keyFilename: process.env.GCLOUD_APPLICATION_CREDENTIALS,
        });
        const uploader = multer({
            storage: multer.memoryStorage(),
            limits: {
                fileSize: 100 * 1024 * 1024, // keep file size < 100 MB
            },
        });
        const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET_URL);



// API TO UPLOAD PDF AND IMAGE ON GOOGLE CLOUD

router.route('/book/:id').post(uploader.array('file'), async (req, res, next) => {
    
    let publicImgUrl;
     console.log('pdf hhhiiitt')
//     try {
//         if (!req.files[0]) {
//             res.status(400).send('No file uploaded.');
//             return;
//         }


//         // This is where we'll upload our PDF and IMG to Cloud Storage
//         const blobPdf = bucket.file(`bookPdf/${req.files[0].originalname}`);
//         const blobImg = bucket.file(`bookImg/${req.files[1].originalname}`)



//         // Create writable stream and specifying file mimetype
//         const blobImgWriter = blobImg.createWriteStream({
//             metadata: {
//                 contentType: req.files[1].mimetype,
//             },
//         });
        
//         const blobPdfWriter = blobPdf.createWriteStream({
//             metadata: {
//                 contentType: req.files[0].mimetype,
//             },
//         });


//         // Sending the file and Assembling public URL for accessing the file via HTTP
//             blobImgWriter.on('error', (err) => next(err));
//             blobImgWriter.on('finish', () => {
//                 publicImgUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name
//             }/o/bookImg%2F${encodeURI(blobImg.name.substr(8,blobImg.name.length))}?alt=media`;
//             }) 
//             console.log('img Written')
//             blobPdfWriter.on('error', (err) => next(err));
//             blobPdfWriter.on('finish', () => {
                
//                 const publicPdfUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name
//             }/o/bookPdf%2F${encodeURI(blobPdf.name.substr(8,blobPdf.name.length))}?alt=media`;
//             //gs://ebook-1f71a.appspot.com/bookImg
//             //gs://ebook-1f71a.appspot.com/bookPdf
            
            
            
//             // Return the file name and its public URL
//             res
//             .status(200)
//             .send({ fileName: req.files[0].originalname, pdffileLocation: publicPdfUrl,imgfileLocation: publicImgUrl });
            
//         });
        
//         console.log('pdf Written')

//         // When there is no more data to be consumed from the stream
//         blobPdfWriter.end(req.files[0].buffer);
//         blobImgWriter.end(req.files[1].buffer)

//     } catch (error) {
//         res.status(400).send(
//             `Error, could not upload file: ${error}`
//         );
//         return;
//     }
});








//API TO DELETE THE BOOK WITH SPECIFIC ID
router.route('/book/').delete((req, res) => {

    let select = 'select pdfName,imgName from booksdetail where id=?'
    const id = req.query.id ;
    pool.query(select,id, (err, result) => {
        if(err)
        {
            res.send(err)
        }
        else if(result.length===0)
        {
            console.log(`Error : No data Found With id : ${id}`);
            res.status(400).send(`Error : No data Found With id : ${id}`);
        }
        else
        {
            bucket.file(`bookPdf/${result[0].pdfName}`).delete();
            bucket.file(`bookImg/${result[0].imgName}`).delete();
            console.log(`book : ${result[0].pdfName} with id : ${id} : Deleted Successfully`);
            
            //now delete the information from local database
            select = 'delete from booksdetail where id =' + "'" + id + "'";

            //    bucket.file(`bookPdf/jee mains.pdf`).delete();  
            pool.query(select, (err, result) => {
                if(err)
                {
                    res.send(err);
                }
                else
                {
                    res.send(result);
                }
            })
        }
    })


})

// const firebase = require('../db');
// const firestore = firebase.firestore();
router.route('/book/fb').post((req , res ) => {
    console.log('here firebase post ')
    res.send('HI')
})


module.exports = router;
