import nodemailer, { Transporter } from 'nodemailer'
import { EmailService, ISendEmailOptions } from "../../../domain/services/email.service";
import { CustomError } from '../../../shared/errors';
import { verificationCodeEmailTemplate } from '../../templates/email/verification-code';

interface NodemailerServiceOptions {
  mailerService: string;
  mailerEmail: string;
  senderEmailPassword: string;
  postToProvider: boolean;
}

export class NodemailerService implements EmailService { 
  
  private transporter: Transporter
  private readonly postToProvider: boolean

  constructor({ mailerEmail, mailerService, senderEmailPassword, postToProvider}: NodemailerServiceOptions){
    
    this.transporter = nodemailer.createTransport({
      service: mailerService,
      auth: {
        user: mailerEmail,
        pass: senderEmailPassword
      }
    })

    this.postToProvider = postToProvider
  }

  async sendValidationCode(sendEmailOptions: ISendEmailOptions, code: string): Promise<void> {
    
    const { to, subject, attachments = [] } = sendEmailOptions

    try { 

      const htmlBody = verificationCodeEmailTemplate( code )

      const sentInformation = await this.transporter.sendMail({
        from: `ClassConnect <${this.transporter.options.from?.toString()}>`,
        to,
        subject,
        html: htmlBody,
        attachments: attachments
      })
      
      console.log(sentInformation)

    } catch (error) {
      throw CustomError.internalServerError('No fue posible enviar el email')
    }

  }

  async sendWelcomeEmail(sendEmailOptions: ISendEmailOptions): Promise<boolean> {
    return true
  }

}