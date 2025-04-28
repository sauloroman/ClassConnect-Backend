export interface IAttachment {
  filename: string;
  path: string;
}

export interface ISendEmailOptions {
  to: string | string[];
  subject: string;
  htmlBody?: string;
  attachments?: IAttachment[];
}

export abstract class EmailService {
  abstract sendWelcomeEmail( sendEmailOptions: ISendEmailOptions ): Promise<void>
  abstract sendValidationCode( sendEmailOptions: ISendEmailOptions, code: string, token: string  ): Promise<void>
  abstract sendRecoverPasswordEmail( sendEmailOptions: ISendEmailOptions, token: string ): Promise<void>
  abstract sendChangedPasswordEmail( sendEmailOptions: ISendEmailOptions ): Promise<void>
}