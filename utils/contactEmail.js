const nodemailer = require('nodemailer');
const pug = require('pug');
const { htmlToText } = require('html-to-text');

module.exports = class ContactEmail {
  constructor(name, email, message, receivers) {
    this.name = name;
    this.email = email;
    this.message = message;
    this.receivers = receivers;
    this.from = `${name} <${email}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send() {
    const html = pug.renderFile(
      `${__dirname}/../views/email/contactEmail.pug`,
      {
        name: this.name,
        email: this.email,
        message: this.message,
      },
    );

    const mailOptions = {
      from: this.from,
      to: this.receivers,
      subject: 'Mesaj nou de contact',
      html,
      text: htmlToText(html),
    };

    await this.newTransport().sendMail(mailOptions);
  }
};
