const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_KEY)

module.exports = {
  mailRegister: function (email: string, firstname: string, lastname: string): void {
    const mail = {
      to: email,
      from: 'esteban94.em@gmail.com',
      subject: 'Welcome to My S3',
      text: `Hello ${firstname} ${lastname}`,
      html: `<h1>Hello ${firstname} ${lastname} <br>Welcome to <span style='color:#6C63FF'>My</span>-S3, your account have been created</h1>`,
    }
    sgMail.send(mail).then(
      () => {
        console.log('send mailRegister')
      },
      (error: { response: { body: JSON } }) => {
        console.error(error)

        if (error.response) {
          console.error(error.response.body)
        }
      }
    )
  },
  mailRestPassword: function (email: string, token: string): void {
    const mail = {
      to: email,
      from: 'esteban94.em@gmail.com',
      subject: 'Reste password My S3',
      text: `Hello, <br>`,
      html: `Hello you can reset your password on this link : http://localhost:4242/api/utilis/passtoken/${token}`,
    }
    sgMail.send(mail).then(
      () => {
        console.log('send mailRestPassword')
      },
      (error: { response: { body: JSON } }) => {
        console.error(error)

        if (error.response) {
          console.error(error.response.body)
        }
      }
    )
  },
}
