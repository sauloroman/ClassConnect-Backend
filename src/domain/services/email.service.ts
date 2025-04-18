export abstract class EmailService {
  abstract sendWelcomeEmail( email: string ): Promise<void>
  abstract sendValidationCode( email: string ): Promise<void>
}