const nodemailer = require('nodemailer');

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.example.com',
  port: 587,
  secure: false, // Set to true if using SSL/TLS
  auth: {
    user: 'your_email@example.com',
    pass: 'your_email_password',
  },
});

// Function to send an email with EJS template
async function sendEmail(to, subject, templateData) {
  try {
    const info = await transporter.sendMail({
      from: 'your_email@example.com',
      to: to,
      subject: subject,
      html: templateData,
    });

    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

module.exports = sendEmail;
