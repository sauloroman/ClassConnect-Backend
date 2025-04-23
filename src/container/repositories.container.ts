import { ClassroomRepository, LoginSessionRepository, UserRepository, ValidateCodeRepository } from "../domain/repositories";
import { PrismaClassroomRepository, PrismaLoginSessionRepository, PrismaUserRepository, PrismaValidateCodeRepository } from "../infrastructure/repositories";

export class RepositoriesContainer {

  private static instance: RepositoriesContainer
  public readonly userRepo: UserRepository
  public readonly validateCodeRepo: ValidateCodeRepository
  public readonly loginSessionRepo: LoginSessionRepository
  public readonly classroomRepo: ClassroomRepository
  
  private constructor(){
    this.userRepo = new PrismaUserRepository()
    this.validateCodeRepo = new PrismaValidateCodeRepository()
    this.loginSessionRepo = new PrismaLoginSessionRepository()
    this.classroomRepo = new PrismaClassroomRepository()
  }

  public static getInstance(): RepositoriesContainer {
    if ( !RepositoriesContainer.instance ) {
      RepositoriesContainer.instance = new RepositoriesContainer()
    }

    return RepositoriesContainer.instance
  }

}