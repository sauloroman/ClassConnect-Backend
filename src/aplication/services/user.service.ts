import { CreateUserDto } from "../../domain/dtos/user/create-user.dto";
import { UserEntity } from "../../domain/entities/user.entity";
import { UserRepository } from "../../domain/repositories/user.repository";
import { EmailService } from "../../domain/services/email.service";
import { CustomError } from "../../shared/errors";
import { bcryptAdapter } from "../../shared/plugins/bcrypt.plugin";

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

  async createUser( dto: CreateUserDto ): Promise<UserEntity> {

    try {
      
      const existing = await this.userRepo.findUserByEmail( dto.email )
      
      if ( existing ) {
        throw CustomError.badRequest(`El usuario con email: ${dto.email} ya existe. Intente con otro correo.`)
      } 
  
      const user = await this.userRepo.createUser( dto )
      user.password = bcryptAdapter.hash( user.password )
      await this.userRepo.updateUser( user.id, { password: user.password} )

      return user

    } catch (error) {
      throw new Error('Error al crear el usuario')
    }

  }


}