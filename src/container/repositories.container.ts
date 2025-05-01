import { 
  ClassroomCategoriesRepository,
  ClassroomCategoryRepository,
  ClassroomRepository, 
  EnrollmentRepository, 
  LoginSessionRepository, 
  UserRepository, 
  ValidateCodeRepository 
} from "../domain/repositories";
import { 
  PrimaClassroomCategoriesRepository,
  PrismaClassroomCategoryRepository,
  PrismaClassroomRepository, 
  PrismaEnrollmentRepository, 
  PrismaLoginSessionRepository, 
  PrismaUserRepository, 
  PrismaValidateCodeRepository 
} from "../infrastructure/repositories";

export class RepositoriesContainer {

  private static instance: RepositoriesContainer
  public readonly userRepo: UserRepository
  public readonly validateCodeRepo: ValidateCodeRepository
  public readonly loginSessionRepo: LoginSessionRepository
  public readonly classroomRepo: ClassroomRepository
  public readonly enrollmentRepo: EnrollmentRepository
  public readonly classroomCategoryRepo: ClassroomCategoryRepository
  public readonly classroomCategoriesRepo: ClassroomCategoriesRepository
  
  private constructor(){
    this.userRepo = new PrismaUserRepository()
    this.validateCodeRepo = new PrismaValidateCodeRepository()
    this.loginSessionRepo = new PrismaLoginSessionRepository()
    this.classroomRepo = new PrismaClassroomRepository()
    this.enrollmentRepo = new PrismaEnrollmentRepository()
    this.classroomCategoryRepo = new PrismaClassroomCategoryRepository()
    this.classroomCategoriesRepo = new PrimaClassroomCategoriesRepository()
  }

  public static getInstance(): RepositoriesContainer {
    if ( !RepositoriesContainer.instance ) {
      RepositoriesContainer.instance = new RepositoriesContainer()
    }

    return RepositoriesContainer.instance
  }

}