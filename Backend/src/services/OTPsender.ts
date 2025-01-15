

// const twilio = require('twilio');
// const { useSuccessResponse, useErrorResponse } = require('./response');

// // app.use(bodyParser.urlencoded({ extended: false }));
// const otpSender = async (phoneNumber, code) => {

//     const accountSid = process.env.TWILIO_ACCOUNT_SID;
//     const authToken = process.env.TWILIO_AUTH_TOKEN;
//     const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

//     const client = twilio(accountSid, authToken);

//     // Function to generate a random OTP
//     // function generateOTP() {
//     //     return Math.floor(1000 + Math.random() * 9000);
//     // }

//     // POST route to send OTP via SMS


//     if (!phoneNumber) {

//         console.log(' Phone number is required.')
//         return false
//     }

//     const message = `Your OTP is: ${code}`;

//     client.messages
//         .create({
//             to: phoneNumber,
//             from: twilioPhoneNumber,
//             body: message,
//         })
//         .then(() => {
//             console.log(`OTP sent to ${phoneNumber}: ${code}`);
//             console.log('OTP sent successfully!\n on', phoneNumber)
//             return phoneNumber
//         })
//         .catch((error) => {
//             console.error('Failed to send OTP:', error.message);
//             console.log('Failed to send OTP.')
//             return false
//         });

// }


// module.exports = {
//     otpSender
// }

import nodemailer from 'nodemailer';
require('dotenv').config();

export const otpSender = async (email: string, code: string, subject: string) => {
    try {
        const transport = nodemailer.createTransport({
            service: 'gmail',
            port: 465,
            secure: true,
            auth: {
                user: process.env.MAIL_EMAIL,
                pass: process.env.MAIL_PASSWORD
            },

            tls: {
                rejectUnauthorized: false
            }
        });


        const mailOptions = {
            from: '"Car Rental" <shahzaibboota65@gmail.com>',
            to: email,
            subject: subject,
            html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>One-Time Password (OTP)</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #ffffff;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #333333;
            text-align: center;
        }
        p {
            color: #555555;
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 20px;
        }
        .otp-code {
            font-size: 24px;
            font-weight: bold;
            color: #4CAF50;
            text-align: center;
            margin-bottom: 30px;
            cursor: pointer; /* Add cursor style to indicate clickability */
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>One-Time Password (OTP)</h1>
        <p>Your one-time password (OTP) for account verification is:</p>
        <div class="otp-code" id="otpCode">${code}</div>
        <p>Please use this OTP to complete the verification process. Note that the OTP is valid for a short period.</p>
        <p>If you didn't request this OTP, please ignore this email.</p>
    </div>

    <script>
        // Get the OTP code element
        var otpCode = document.getElementById("otpCode");

        // Add a click event listener
        otpCode.addEventListener("click", function() {
            // Create a range and select the text
            var range = document.createRange();
            range.selectNode(otpCode);

            // Add the selected text to the clipboard
            window.getSelection().removeAllRanges(); // Clear previous selections
            window.getSelection().addRange(range);   // Select the text
            document.execCommand("copy");            // Copy the selected text to the clipboard

            // Optionally, you can give visual feedback to the user
            otpCode.style.backgroundColor = "#c0e218";
            setTimeout(function() {
                otpCode.style.backgroundColor = "";
            }, 1000); // Reset the background color after 1 second
        });
    </script>
</body>
</html>
`
        };
        await transport.sendMail(mailOptions);
        console.log(mailOptions)
        console.log('Email sent successfully');
        return true;
    } catch (err) {
        console.log('Email sent failed');
        console.error(err);
        return false;
    }
};
