const nodemailer = require('nodemailer')

export function sendEmailPdf (
  pdfBuffer: Buffer | null,
  email: string
) {
  return new Promise((resolve, reject) => {
    // EMAIL PDF
    const transportOptions: any = {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT
    }

    // Only include auth if not in production
    if (process.env.ENV !== "prod") {
      transportOptions.auth = {
        user: process.env.EMAIL_USER, // generated ethereal user
        pass: process.env.EMAIL_PASSWORD // generated ethereal password
      }
    }

    const transporter = nodemailer.createTransport(transportOptions)

    const mailOptions: any = {
      from: 'noreply-solaire-coopterr@rennesmetropole.fr',
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
        filename: 'solarSimulation.pdf',
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
        reject(error.message);
      } else {
        resolve(info.response);
      }
    });
  });
}
