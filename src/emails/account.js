const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

sgMail.send({
    to: 'sibalatanics@outlook.com',
    from: 'sibalatanics@outlook.com',
    subject: 'This is my first creation!',
    text: 'I hope this actually gets to you'
})