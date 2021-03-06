const fs = require('fs');
const path = require('path')
var nodemailer = require('nodemailer');
const mustache = require('mustache');
var handlebars = require('handlebars');

const config = {
    host: 'goes2nobel.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: 'info@goes2nobel.com',
        pass: 'goestonobel123'
    }
}

const sendMailRegister = async (params) => {

    const template = await fs.readFileSync('./public/views/test1.html', 'utf8');
    var transporter = await nodemailer.createTransport(config);

    var mailOptions = {
        from: '"GoesToNobel" info@goes2nobel.com',
        to: params.email,
        subject: '[Node Email] - Success Registration',
        html: mustache.render(template, params),
        attachments:[
            {
                filename : 'h1.gif',
                path: path.join(__dirname + './../../public/views/images/h1.gif'),
                cid : 'h1'
            },
            {
                filename : 'fb.gif',
                path: path.join(__dirname + './../../public/views/images/fb.gif'),
                cid : 'fb'
            },
            {
                filename : 'tw.gif',
                path: path.join(__dirname + './../../public/views/images/tw.gif'),
                cid : 'tw'
            },
            {
                filename : 'left.gif',
                path: path.join(__dirname + './../../public/views/images/left.gif'),
                cid : 'left'
            },{
                filename : 'right.gif',
                path: path.join(__dirname + './../../public/views/images/right.gif'),
                cid : 'right'
            },
        ]
        // html: `<h4>Your Account Has Been Registered!</h4>`,
        // text: "Your Account Has Been Registered!"
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Failed: ", error);
        } else {
            console.log('Email sent: ' + JSON.parse(info));
        }
    });
}



const sendMailRegister2 = async (params) => {

    var readHTMLFile = function(path, callback) {
        fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
            if (err) {
                callback(err);
                throw err;
            }
            else {
                callback(null, html);
            }
        });
    };
    
    var transporter = await nodemailer.createTransport(config);
    const path_file = path.join(__dirname + './../../public/views/test1.html')

    readHTMLFile(path_file, function(err, html) {
        var template = handlebars.compile(html);
        var htmlToSend = template(params);

        var mailOptions = {
            from: '"GoesToNobel" info@goes2nobel.com',
            to: params.email,
            subject : 'test subject',
            html : htmlToSend
         };
    
        transporter.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error);
                callback(error);
            }else{
                console.log("Email Sent :", response)
            }
        });
    });
}

module.exports = { sendMailRegister, sendMailRegister2}



