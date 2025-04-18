import { UserRepository } from "../../domain/repositories/user.repository";
import { EmailService } from "../../domain/services/email.service";

interface Options {
  userRepo: UserRepository,
  emailSender: EmailService,
}

export class UserService {

  private readonly userRepo: UserRepository
  private readonly emailSender: EmailService
  
  constructor({emailSender, userRepo}: Options){
    this.userRepo = userRepo
    this.emailSender = emailSender
  }

  

}