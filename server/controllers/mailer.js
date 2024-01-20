import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';

import ENV from '../config.js';

// Update these with your Gmail credentials
let nodeConfig = {
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: ENV.EMAIL, // your Gmail email address
        pass: ENV.PASSWORD, // your Gmail password or App Password
    }
};

let transporter = nodemailer.createTransport(nodeConfig);

let MailGenerator = new Mailgen({
    theme: "default",
    product: {
        name: "Mailgen",
        link: 'https://mailgen.js/'
    }
});

export const registerMail = async (req, res) => {
    const { username, userEmail, text, subject } = req.body;
    // body of the email
    var email = {
        body: {
            name: username,
            intro: text || 'Welcome to Daily Tuition! We\'re very excited to have you on board.',
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    };

    var emailBody = MailGenerator.generate(email);

    let message = {
        from: ENV.EMAIL,
        to: userEmail,
        subject: subject || "Signup Successful",
        html: emailBody
    };

    // send mail
    transporter.sendMail(message)
    .then(() => {
        return res.status(200).send({ msg: "You should receive an email from us." });
    })
    .catch(error => {
        console.error("Error sending email:", error);
        return res.status(500).send({ error: "An error occurred while sending the email." });
    });
};
