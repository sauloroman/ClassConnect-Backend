import { EmailService } from "../../../domain/services/email.service";

export class NodemailerService implements EmailService { 

  async sendValidationCode(email: string): Promise<void> {
    
  }

  async sendWelcomeEmail(email: string): Promise<void> {
  
  }

}