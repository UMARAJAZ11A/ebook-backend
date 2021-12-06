const nodemailer = require('nodemailer');

const sendEmail = async (email , subject , msg) => {

    const transpoter = nodemailer.createTransport({
        host : process.env.SMTP_HOST ,
        port : process.env.SMTP_PORT ,
        auth : {
            user : process.env.SMTP_EMAIL ,
            pass : process.env.SMTP_PASSWORD ,
        }
    });
    // console.log(email,subject , msg)
    const message = {
        
        from : `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>` ,
        to : email ,
        subject : subject ,
        text : msg
    }

    await transpoter.sendMail(message);



}

module.exports = sendEmail ;