const nodemailer = require('nodemailer');
const pug = require('pug');
const { htmlToText } = require('html-to-text');
const path = require('path');

module.exports = class GuideEmail {
  constructor(name, email, phone, experience, receivers, cvPath) {
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.experience = experience;
    this.receivers = receivers;
    this.cvPath = cvPath;
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
      path.join(__dirname, '../views/email/guideApplication.pug'),
      {
        name: this.name,
        email: this.email,
        phone: this.phone,
        experience: this.experience,
      },
    );

    const mailOptions = {
      from: this.from,
      to: this.receivers,
      subject: 'Cerere nouă de devino ghid',
      html,
      text: htmlToText(html),
      attachments: [
        {
          filename: path.basename(this.cvPath),
          path: this.cvPath,
        },
      ],
    };

    await this.newTransport().sendMail(mailOptions);
  }
};
