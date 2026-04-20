import nodemailer from "nodemailer";
import { EMAIL_App, Email_App_password,App_Name } from "../../../../config/config.service.js";
export const sendEmail = async ({ to,cc,bcc, subject, html,attachments=[] }={}) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: EMAIL_App,
            pass: Email_App_password
        },
    });

    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: `${App_Name} <${EMAIL_App}>`, // sender address
        to, // list of receivers
        cc, // carbon copy
        bcc, // blind carbon copy
        subject, // Subject line
        attachments, // list of attachments
        html, // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

};