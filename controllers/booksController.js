const pool = require('../sql');

const { Storage } = require('../node_modules/@google-cloud/storage');  //@google-cloud/storage

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

// API Setup for Storage of file on google firebase =>/book/:id 
const cred = {
            
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCofMIV1JIPkV2e\nTUhSZHAFF9MklQneslGsiAM6OwPzX+QvvrJWMktyyQb1eamdVD7BhNRlG1OADowx\nkQJQ8XjCn0RcwCVHSx7SMJJJKTTIXxnEUI/FCx0APOOlL0KFe+o4moDLQsQit5qn\n3MArGeMtlU6xrMg3oIE8r2pF3lXn96RlBRvUAWdknC2WUGj/XJBjyhbzm/nEVRgj\n+BIPbgUkTDLWvtkLxqLDhGbECF5EBwwzR3sXY2p+THISXd7Vdaq9SEtMyf5Cy10A\nyQDBrxC+ieleXAQirFfGRhOm4B/y8s6cFp3ogDbi0CbY++0hLRLNpH8gXAWeOK1f\nnlfah+3/AgMBAAECggEAQAusez/ihahsPdCCvU8Qhd8Yk79TkSOXiE3rbCciyVCa\nHMwQXlOf+nIQAx/MKdHsSQOE+Sn6A6OEBxNoHfysOs7v3ZHsmb0kaiGsecMAHWqJ\nEObOv8gJrh13K0NbtgH0dq/EZX9rrwa78zMmmTut75Xh5AgZ04tflQHZE9YAMbyC\nV9ol9i0UoTzrQkThNdW5i8zezPIhxRTB684vFqdj7pyL4ICvrlqFU9EhoGSxHmAR\noaf+TvW/yWtd0pwlUvfI3qxpbcTwVn9c2MdyZrTyYii9LUp/nV+cyOiNPtPxR/gm\nGreg5VyYo+Z8WTYT1OamzZnjMmvN/x20AckF7AuVAQKBgQDkRlwZaQ91SozOSvgc\nuFjER+4tGuDhziigVcfJhvqq+3T2hKfuYyauMXoOBeECl46Jj+yyEaj6AJ5fScKH\nYpWBiF5j19BM6VPykv83IxmpCncA2XtiXUY5OV0RGsa8S4AfhZyTkVXSYpM2U825\njHBhl6LLF5H38wN+sawiby0iGQKBgQC883RA5L+FxGHIM6rM6D0Fea0cDtClSaGg\naTwCcN9EOuwCT6iW+rq3wKtBtV/nEb2Q7MA7Yul53xDQiy0ZeNMM3DzaMuVTBR9q\n1qStr++980LCziEdqXSl8aTgmeXs0kOuEmO5ejZqajcElRqqgeK3lGA8YBsbiDsR\nvz2ZAUoD1wKBgBG45K2UWn7gqs3ZRCn2pe2XKAaYb50YRE8uWbRrpkpf+1SoN+Fq\nETa04KT2D+IDoi1L3zRz6op+Qc1kDJY2MSU9URavSpyuALZ0cxv0valCBrsqJ0ob\ns7f9nBwX2BYGRowr81wBjIgo3wT4vKALJy5sd1cNHWgCleLgKF0EBJ0BAoGBAKIy\n0r7KHmZz+ARl5d7UFV3X33RQe2cH2AjdjTgDMIVfly08uFoyjYojiF91lQfEQNhh\ng3r3I7kMdWCvuF0/TNyjSlF8k0M7CIcsDl1SxBho9AxJ6j+OMaYp0wFC2w76SELr\nYlPbx05+MxBp9mQb70Trx9jMHzj5LsvDQNtRMfotAoGBALVueEpC7meWgh9lxKoE\ncr1gefHAQwAE4/BnntDJNVinKdW50omQPh7HQisqTxA2IN3tvrb033qP2PEyH4xs\nt2z3DjgGQTKvUZKYrCxoaIvR/IuJ9g6P6QUJtUq3k+fvGYFBGsDOs4nw/jUUVZJg\nT4Kppva1og6zwfiFSVf6r2iV\n-----END PRIVATE KEY-----\n",
    client_email : "firebase-adminsdk-fh0x8@ebook-1f71a.iam.gserviceaccount.com",
}
const storage = new Storage({
    projectId: process.env.GCLOUD_PROJECT_ID,
    credentials : cred, 
});

const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET_URL);

//Function to upload file at google cloud
// value = Img/Pdf => describe the file we are uploading
const UploadFile = async ( file , blob , value ) => {
    
    return new Promise((resolve, reject)=>{
        
        // Create writable stream and specifying file mimetype
        const blobWriter = blob.createWriteStream({
            metadata: {
                contentType: file.mimetype,
            },
        });
        
        
            blobWriter.on('error', (err) => reject(err));
        
            blobWriter.on('finish', () => {
    
                let publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name
                }/o/book${value}%2F${encodeURI(blob.name.substr(8,blob.name.length))}?alt=media`;

                console.log(`${value} Written`)
                resolve(publicUrl) ;
            })

            // When there is no more data to be consumed from the stream
            blobWriter.end(file.buffer);
                // blobImgWriter.end(req.files[1].buffer);

    });

}


// Query Filter
const queryFilter = async (query ) => {

    let select = `select * from books` ;
    if(query.column)
    {
        select = `select ${query.column} from books`
    }
    if(query.field)
    {
        if(query.searchType === 'like')
        select += ` where ${query.field} like ` +  `'`+`%`+`${query.fieldValue}`+`%`+`'`;
        else if(query.searchType ==='IN')
        select += ` where ${query.field} IN(${query.fieldValue})`;
        else
        select += ` where ${query.field}='${query.fieldValue}'`;
        
    }
    if(query.lowerLimit)
    {
        select += ` limit ${query.lowerLimit},${query.upperLimit} `;
        
    }
    return select ;
}


// Get all Books By Query => /books/       // req.query
exports.getBooksByQuery = async (  req , res , next ) => {

    // const fields = [ 'id','category' , 'author' , 'type' ];   // available fields
    // const searchType = ['=' , 'like' , 'in']
    const select = await queryFilter(req.query) ;
    
    try {
        const result =  await getQuery(select , '');
        res.status(200).send(result);
        //  res.status(200).send({
        //      success : true ,
        //      results : result.length ,
        //      data : result
        //  });
         
     } catch (error) {
         
        res.status(400).send({
            success : false ,
            message : `Error : ${error}`
        });

     }  
    
}


// Get List of all Category/Author/Name/Type => /book/list       // req.query
exports.getBooksList = async (  req , res , next ) => {

    // const fields = [ 'id','category' , 'author' , 'type' ];   // available fields
    // const searchType = ['=' , 'like' , 'in']
    const field = req.query.field ;
    const Limit = req.query.limit ? req.query.limit : null ;
    const indx = req.query.index ? req.query.index : null ;
    
    let select = `select distinct ${field} from books` ;

    if(indx&&Limit)
    select += ` limit ${indx},${Limit}` ;
    
    
    try {
        const result =  await getQuery(select , '');
        // res.status(200).send(result);
         res.status(200).send({
             success : true ,
             length : result.length ,
             data : result 
         });
         
     } catch (error) {
         
        res.status(400).send({
            success : false ,
            message : `Error : ${error}`
        });

     }  
    
}




// Get Books by query => /book
// exports.getBooks =async (req, res , next) => {
    
//          const searchForColumn = req.query.searchForColumn ;
//          const searchInColumn = req.query.searchInColumn ;
//          const searchValue = req.query.searchValue ;

//          const select = `select ${searchForColumn} from books ${searchInColumn} ${searchValue}`;
         
//          const errorMessage = `Error couldn't find data in sql database : `

//          try {
//             const result =  await getQuery(select , '');

//              res.status(200).send(result);
             
//          } catch (error) {
             
//             res.status(400).send(error)

//          }  
// };



//API TO GET BOOK DEATILS/PDF_URL WITH SPECIFIC ID => books/:id
exports.getBookDetails = async (req,res,next) => {
    
    const values = req.params.id;
    if(req.query.searchFor ==='book')
    {
        const select = 'select * from books where id=?';
        // console.log(req.query,"here book search")
        try {
            const result =  await getQuery(select , values);

             res.status(200).send(result);
             
         } catch (error) {
             
            res.status(400).send(`Error couldn't get the data from sql database : 
                                    ${error} `)

         }  
        
    }
    else
    {
        const select = 'select pdfUrl from books where id=?';
        // console.log(req.query,"here pdf search")
        try {
            const result =  await getQuery(select , values);
            if(result.length===0)
            {
                console.log(`No PDF_URL Found with id : ${values}`);
                res.status(400).send(`No PDF_URL Found with id : ${values}`);
            }
            else
            {
                res.status(200).send(result);
            }
            
             
         } catch (error) {
             
            res.status(400).send(`Error couldn't get the data from sql database : 
                                    ${error} `);
         }          
    }

};



//API TO UPLOAD BOOK DETAILS ON LOCAL SQL DATABASE  => /book/upload/
exports.setBook = async (req,res,next) => {
    
    const book = JSON.parse( req.query.book ) ;
    
    try {

        if (req.files==null||!req.files[0]||!req.files[1]) {
            res.status(400).send('No file uploaded.');
            return;
        }

        // This is where we'll upload our PDF and IMG to Cloud Storage
        const blobPdf = bucket.file(`bookPdf/${req.files[0].originalname}`);
        const blobImg = bucket.file(`bookImg/${req.files[1].originalname}`);
        
        console.log(`Uploading the book with Id : ${book.id}....` );

        // Sending the file and Assembling public URL for accessing the file via HTTP
        let publicImgUrl = await UploadFile(req.files[1] , blobImg , `Img`) ;


        let publicPdfUrl = await UploadFile(req.files[0] , blobPdf , `Pdf`) ;

                console.log(`Book uploaded on Google Database Successfully!`);
   

        const fileUrl = {
            imgUrl : publicImgUrl ,
            pdfUrl : publicPdfUrl
        }
      
        const select = 'insert into books values(?,?,?,?,?,?,?,?,?,?,?,?,?)';
        const values = [    book.id, book.bookName,
                            book.authorName, book.rating, book.category, 
                            book.type,book.description, book.date, 200, 
                            fileUrl.imgUrl,fileUrl.pdfUrl,book.imgName,book.pdfName]
    
                            
        await getQuery(select , values);
                            
                console.log(`Book uploaded on local database Successfully!`);


        // Return the file name and its public URL
        res.status(200).send({
            success : true ,
            message : 'Book Uploaded Successfully!'
        })

         
     } catch (error) {
         
        res.status(400).send(`Error couldn't upload data on sql database : 
                                ${error} `)

     }  

};






//API TO DELETE THE BOOK WITH SPECIFIC ID =>/book/:id
exports.deleteBook = async (req, res , next) => {

let select = 'select pdfName,imgName from books where id=?'
const id = req.query.id ;
try {
    let result =  await getQuery(select , id);

    if(result.length===0)
    {
        console.log(`Error : No data Found With id : ${id}`);
        res.status(400).send(`Error : No data Found With id : ${id}`);
    }

    //now delete the information (PDF/IMG) from Google cloud database
    await bucket.file(`bookPdf/${result[0].pdfName}`).delete();
    await bucket.file(`bookImg/${result[0].imgName}`).delete();
    console.log(`book : ${result[0].pdfName} with id : ${id} : Deleted Successfully`);

    //now delete the information from local database
    select = 'delete from books where id =' + "'" + id + "'";
    result =  await getQuery(select , '');

     res.status(200).send(result);
     
 } catch (error) {
     
    res.status(400).send(error)

 }  


};
