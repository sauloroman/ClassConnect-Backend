import { UserRepository } from "../domain/repositories/user.repository";
import { ValidateCodeRepository } from "../domain/repositories/validate-code.reposity";
import { PrismaUserRepository, PrismaValidateCodeRepository } from "../infrastructure/repositories";

export class RepositoriesContainer {

  private static instance: RepositoriesContainer
  public readonly userRepo: UserRepository
  public readonly validateCodeRepo: ValidateCodeRepository

  private constructor(){
    this.userRepo = new PrismaUserRepository()
    this.validateCodeRepo = new PrismaValidateCodeRepository()
  }

  public static getInstance(): RepositoriesContainer {
    if ( !RepositoriesContainer.instance ) {
      RepositoriesContainer.instance = new RepositoriesContainer()
    }

    return RepositoriesContainer.instance
  }

}