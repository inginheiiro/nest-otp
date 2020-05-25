import * as NodeMailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import {readFileSync} from 'fs';
import {Logger} from '@nestjs/common';
import * as appRoot from 'app-root-path';


export class Email {
    private readonly logger = new Logger(Email.name);

    config: any = {
        host: process.env.MAIL_SERVER,
        port: process.env.MAIL_PORT,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD
        }
    };

    constructor(config?: any) {
        if (config) {
            this.config = config;
        }
    }

    sendOTP(from: string, to: string, subject, tokenObj: any): void {

        const transporter = NodeMailer.createTransport(this.config);
        let file = readFileSync(`${appRoot.path}/src/asset/otp.html`, 'utf-8');

        file = file.replace('${minutes}', (parseInt(process.env.OTP_STEP,10)/60).toString());
        file = file.replace('${token}', tokenObj.token);
        file = file.replace('${qrCode}', tokenObj.qrCode);
        const mailOptions: Mail.Options = {
            from,
            to,
            subject,
            html: file
        };


        transporter.sendMail(mailOptions, (err, info: SMTPTransport.SentMessageInfo) => {
            if (err) {
                this.logger.error(err);
                throw err;
            }
            this.logger.debug(`Message sent: ${info.messageId}`);
            this.logger.debug(`Preview URL: ${NodeMailer.getTestMessageUrl(info).toString()}`);
        });


    }
}
