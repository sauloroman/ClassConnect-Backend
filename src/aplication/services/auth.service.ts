import { ValidateUserDto } from "../../domain/dtos/user"
import { UserEntity } from "../../domain/entities"
import { UserRepository } from "../../domain/repositories/user.repository"
import { StatusVerificationCode } from "../../shared/enums"
import { CustomError } from "../../shared/errors"
import { jwtAdapter } from "../../shared/plugins"
import { ValidateCodeService } from "./validate-code.service"

interface AuthServiceOptions {
  userRepo: UserRepository,
  validateCodeService: ValidateCodeService
}

export class AuthService {

  private readonly userRepo: UserRepository
  private readonly validateCodeService: ValidateCodeService

  constructor({ userRepo, validateCodeService }: AuthServiceOptions) {
    this.userRepo = userRepo
    this.validateCodeService = validateCodeService
  }

  async validateAccount( dto: ValidateUserDto ): Promise<{ user: UserEntity, token: unknown }> {
    
    const user = await this.userRepo.findUserByEmail( dto.email )
    if (!user) throw CustomError.notFound(`El usuario con email: ${dto.email} no existe`)

    const statusValidationCode = await this.validateCodeService.verifyCodeStatus( user.id, dto.code )
    
    if ( statusValidationCode === StatusVerificationCode.Expired )
      throw CustomError.badRequest(`El código ha expirado. Genera uno nuevo`)

    if ( statusValidationCode === StatusVerificationCode.Invalid ) 
      throw CustomError.unauthorized('El código ingresado no es correcto')

    const userUpdated = await this.userRepo.updateUser( user.id, { isAccountVerified: true } )

    const payload = {
      id: user.id,
      role: user.role,
      email: user.email,
    }
    const token = await jwtAdapter.generateJWT(payload)

    return { 
      user: {
        ...userUpdated,
        password: ''
      }, 
      token 
    }
  }

  async resentValidationCode( email: string ) {

    const user = await this.userRepo.findUserByEmail( email )
    if ( !user ) throw CustomError.notFound(`El usuario con email: ${email} no existe`)

    if ( user.isAccountVerified ) {
      throw CustomError.badRequest('El usuario ya esta verificado')
    }

    await this.validateCodeService.generateValidationCode( user.id, email )

  }
  
}