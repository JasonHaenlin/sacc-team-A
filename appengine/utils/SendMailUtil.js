
const mailer = require('nodemailer');
const smtp = require('nodemailer-smtp-transport');

class SendMailUtil{

    constructor(){
         
    }

    static async sendMail(from,to,subject,content) {
    const transport = mailer.createTransport(
        smtp({
        host: 'in.mailjet.com',
        port: 2525,
        auth: {
            user: process.env.MAILJET_API_KEY || '<your-mailjet-api-key',
            pass: process.env.MAILJET_API_SECRET || '<your-mailjet-api-secret>',
        },
        })
    );

    const json = await transport.sendMail({
        from: from, // From address
        to: to, // To address
        subject: subject, // Subject
        text: content, // Content
    });
    console.log(json);
}
    
}
module.exports = SendMailUtil;