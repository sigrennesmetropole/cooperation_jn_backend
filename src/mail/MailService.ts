const nodemailer = require('nodemailer')

export function sendEmailPdf (
  pdfBuffer: Buffer | null,
  email: string
) {
  // EMAIL PDF
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true, // use TLS
    auth: {
      user: process.env.EMAIL_USER, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD // generated ethereal password
    },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false 
    }
  })

  const mailOptions: any = {
    from: 'testpdf@gmail.com',
    to: email,
    subject: 'Votre simulation d\'installation photovoltaïque',
    text: `
            Bonjour,
            Veuillez trouver ci joint votre simulation d'installation photovoltaïque.
            Cordialement
        `
  }

  // If pdfBuffer is provided, include it in the attachments
  if (pdfBuffer) {
    mailOptions.attachments = [{
      filename: 'attachment.pdf',
      content: pdfBuffer
    }]
  }

  transporter.sendMail(mailOptions, function (
    // @ts-ignore
    error,
    // @ts-ignore
    info
  ) {
    if (error) {
      console.log(error)
    } else {
      console.log('Email sent: ' + info.response)
    }
  })
}
