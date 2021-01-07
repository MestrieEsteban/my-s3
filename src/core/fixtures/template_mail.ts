const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_KEY)

module.exports = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  mailRegister: function (email: string, nickname: string): void {
    const mail = {
      to: email,
      from: 'esteban94.em@gmail.com',
      subject: 'Welcome to My S3',
      text: `Hello ${nickname}`,
      html: `<h1>Hello ${nickname} <br>Welcome to <span style='color:#6C63FF'>My</span>-S3, your account have been created</h1>`,
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
		html: `Hello you can reset your password on this link : https://my-s3-app.herokuapp.com/auth/passToken?token=${token}`,
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
