import { LoginSessionRepository, UserRepository, ValidateCodeRepository } from "../domain/repositories";
import { PrismaLoginSessionRepository, PrismaUserRepository, PrismaValidateCodeRepository } from "../infrastructure/repositories";

export class RepositoriesContainer {

  private static instance: RepositoriesContainer
  public readonly userRepo: UserRepository
  public readonly validateCodeRepo: ValidateCodeRepository
  public readonly loginSessionRepo: LoginSessionRepository
  
  private constructor(){
    this.userRepo = new PrismaUserRepository()
    this.validateCodeRepo = new PrismaValidateCodeRepository()
    this.loginSessionRepo = new PrismaLoginSessionRepository()
  }

  public static getInstance(): RepositoriesContainer {
    if ( !RepositoriesContainer.instance ) {
      RepositoriesContainer.instance = new RepositoriesContainer()
    }

    return RepositoriesContainer.instance
  }

}