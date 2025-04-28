import nodemailer, { Transporter } from 'nodemailer'
import { EmailService, ISendEmailOptions } from "../../../domain/services/email.service";
import { CustomError } from '../../../shared/errors';
import { verificationCodeEmailTemplate, forgotPasswordEmailTemplate, passwordChangedTemplate } from '../../templates/email';

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

  async sendValidationCode(sendEmailOptions: ISendEmailOptions, code: string, token: string ): Promise<void> {
    
    const { to, subject } = sendEmailOptions

    try { 

      const htmlBody = verificationCodeEmailTemplate( code, token )

      const sentInformation = await this.transporter.sendMail({
        from: `ClassConnect <${this.transporter.options.from?.toString()}>`,
        to,
        subject,
        html: htmlBody,
      })
      
      console.log(sentInformation)

    } catch (error) {
      throw CustomError.internalServerError('No fue posible enviar el email para verificar la cuenta')
    }

  }

  async sendRecoverPasswordEmail(sendEmailOptions: ISendEmailOptions, token: string): Promise<void> {
    
    try {
      const { to, subject } = sendEmailOptions

      const htmlBody = forgotPasswordEmailTemplate( token )
  
      const sentInformation = await this.transporter.sendMail({
        from: `ClassConnect <${this.transporter.options.from?.toString()}>`,
        to,
        subject,
        html: htmlBody
      })
  
      console.log(sentInformation)
    } catch (error) {
      throw CustomError.internalServerError('No fue posible enviar el email para recuperar contraseña')
    }

  }

  async sendWelcomeEmail(sendEmailOptions: ISendEmailOptions): Promise<void> {
    return
  }

  async sendChangedPasswordEmail(sendEmailOptions: ISendEmailOptions): Promise<void> {
  
    try {

      const { to, subject } = sendEmailOptions

      const htmlBody = passwordChangedTemplate()

      const sentInformation = await this.transporter.sendMail({
        from: `ClassConnect <${this.transporter.options.from?.toString()}>`,
        to,
        subject,
        html: htmlBody
      })

      console.log(sentInformation)

    } catch (error) {
      throw CustomError.internalServerError('No fue posible enviar el email de confirmación de cambio de contraseña')
    }

  }

}