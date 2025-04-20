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
  abstract sendWelcomeEmail( sendEmailOptions: ISendEmailOptions ): Promise<boolean>
  abstract sendValidationCode( sendEmailOptions: ISendEmailOptions, code: string  ): Promise<void>
}