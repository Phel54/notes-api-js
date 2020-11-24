require('dotenv').config();

const sgMail = require('@sendgrid/mail');


exports.NewUser = function sendEmail(email, name) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
 const msg = {
  to: email, // Change to your recipient
  from: {email: 'machudigital@gmail.com', name:"Kuntana Africa"}, // Change to your verified sender
  subject: 'Welcome',
  html: `<strong>Hi ${name}, Thank you for registering with Startups-Crowd</strong>`,
}
sgMail
  .send(msg)
  .then(() => {
    console.log('...Email sent...')
  })
  .catch((error) => {
    console.error(error)
  })
}

exports.UserRecoverPass = function sendEmail(email, name, token) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
 const msg = {
  to: email, // Change to your recipient
  from: {email: 'machudigital@gmail.com', name:"Kuntana Africa"}, // Change to your verified sender
  subject: 'Recover Password',
  html: `<strong>Hi ${name}, This is your recover token: ${token}</strong>`,
}
sgMail
  .send(msg)
  .then(() => {
    console.log('...Email sent...');
  })
  .catch((error) => {
    console.error(error)
  })
}

exports.NewAdmin = function sendEmail(email, name) {
  
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const msg = {
to: email, // Change to your recipient
from: {email: 'machudigital@gmail.com', name:"Kuntana Africa"}, // Change to your verified sender
subject: 'Admin Registration',
html: `<strong>Hi ${name}, Welcome New Admin</strong>`,
}
sgMail
.send(msg)
.then(() => {
  console.log('...Email sent...');
})
.catch((error) => {
  console.error(error)
})
}


exports.AdminRecoverPass = function sendEmail(email, name, token) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
 const msg = {
  to: email, // Change to your recipient
  from: {email: 'machudigital@gmail.com', name:"Kuntana Africa"}, // Change to your verified sender
  subject: 'Recover Password',
  html: `<strong>Hi ${name}, This is your recover token: ${token}</strong>`,
}
sgMail
  .send(msg)
  .then(() => {
    console.log('...Email sent...');
  })
  .catch((error) => {
    console.error(error)
  })
}

exports.NewStartup = function sendEmail(name, email) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const msg = {
to: email, // Change to your recipient
from: {email: 'machudigital@gmail.com', name:"Kuntana Africa"}, // Change to your verified sender
subject: 'Welcome',
html: `<strong>Hi ${name}, Thank you for registering your Startup</strong>`,
}
sgMail
.send(msg)
.then(() => {
  console.log('...Email sent...')
})
.catch((error) => {
  console.error(error)
})
}