import Nodemailer from 'nodemailer';
import hbs, { NodemailerExpressHandlebarsOptions } from 'nodemailer-express-handlebars';
import path from 'path';

class MailService {
  private mailTransport = Nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.GOOGLE_USERNAME,
      pass: process.env.GOOGLE_PASSWORD,
    },
  });

  public __handlebarsInit = () => {
    try {
      const hbsOptions: NodemailerExpressHandlebarsOptions = {
        viewEngine: {
          extname: '.hbs',
          layoutsDir: path.resolve('views/email'),
          defaultLayout: 'auth-mail.hbs',
          partialsDir: path.resolve('views/email/partials/'),
        },
        viewPath: path.resolve('views/email/'),
        extName: '.hbs',
      };
      this.mailTransport.use('compile', hbs(hbsOptions));
    } catch (error) {
      console.log(error);
    }
  };

  private confirm = (mailOptions: any) => {
    return new Promise((resolve, reject) => {
      this.mailTransport.sendMail(mailOptions, function (error, info) {
        if (error) {
          reject(error);
        } else {
          resolve(info.response);
        }
      });
    });
  };

  public sendMail = async (email: string, subject: string, body: string, context?: any) => {
    const mailOptions = {
      from: process.env.GOOGLE_USERNAME,
      to: email,
      subject,
      template: body,
      attachments: [
        {
          filename: 'email.png',
          path: 'assets/images/email.png',
          cid: 'email',
        },
      ],
      context,
    };
    try {
      this.__handlebarsInit();
      await this.confirm(mailOptions);
    } catch (error) {
      console.log('error', error);
    }
  };
}

export default MailService;
