import { LoginSessionRepository } from "../../domain/repositories";
import { CreateLoginSessionDto } from "../../domain/dtos/login-session";

interface LoginSessionServiceOptions {
  loginSessionRepo: LoginSessionRepository
}

export class LoginSessionService {

  private readonly loginSessionRepo: LoginSessionRepository

  constructor({loginSessionRepo}: LoginSessionServiceOptions){
    this.loginSessionRepo = loginSessionRepo
  }

  async registerLoginSession( createLoginSessionDto: CreateLoginSessionDto): Promise<void> {
    const loginSessionEntity = await this.loginSessionRepo.save( createLoginSessionDto )
    console.log({ loginSessionEntity })
  }

}