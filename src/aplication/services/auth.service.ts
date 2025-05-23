import { LoginSessionEntity, UserEntity } from "../../domain/entities"
import { ChangePasswordDto, ForgotPasswordDto, LoginDto, ValidateAccountDto } from "../../domain/dtos/auth"
import { UserRepository } from "../../domain/repositories"
import { EmailService } from "../../domain/services/email.service"
import { ValidateCodeService } from "./validate-code.service"
import { StatusVerificationCode } from "../../shared/enums"
import { CustomError } from "../../shared/errors"
import { bcryptAdapter, jwtAdapter } from "../../shared/plugins"
import { LoginSessionService } from "./login-session.service"
import { SessionInfo } from "../../domain/interfaces"

interface AuthServiceOptions {
  userRepo: UserRepository,
  validateCodeService: ValidateCodeService,
  loginSessionService: LoginSessionService,
  emailSender: EmailService,
}

export class AuthService {

  private readonly userRepo: UserRepository
  private readonly loginSessionService: LoginSessionService
  private readonly validateCodeService: ValidateCodeService
  private readonly emailSender: EmailService

  constructor({ userRepo, loginSessionService, validateCodeService, emailSender }: AuthServiceOptions) {
    this.userRepo = userRepo
    this.loginSessionService = loginSessionService
    this.emailSender = emailSender
    this.validateCodeService = validateCodeService
  }

  async login( loginDto: LoginDto, sessionInfo: Partial<LoginSessionEntity> ): Promise<{ user: UserEntity, token: unknown }> {

    const { email, password } = loginDto

    const user = await this.userRepo.findUserByEmail( email )
    if ( !user ) throw CustomError.badRequest(`Las credenciales no son correctas`)
    
    if ( !user.isActive ) throw CustomError.badRequest('El usuario no esta activo. Hable con el administrador.')
    if ( !user.isAccountVerified ) throw CustomError.badRequest('El usuario no ha verificado su correo electrónico.')
 
    const isPasswordCorrect = bcryptAdapter.compare( password, user.password )
    if ( !isPasswordCorrect ) throw CustomError.badRequest('Las credenciales no son correctas')

    await this.loginSessionService.registerLoginSession({ userId: user.id, ...sessionInfo })

    const payload = {
      id: user.id,
      role: user.role,
      email: user.email
    }
    const token = await jwtAdapter.generateJWT( payload )

    return {
      user: { ...user, password: '' },
      token
    }
  }

  async forgotPassword( forgotPasswordDto: ForgotPasswordDto ): Promise<void> {

    const user = await this.userRepo.findUserByEmail( forgotPasswordDto.email )
    if ( !user ) throw CustomError.notFound(`El usuario con email: ${forgotPasswordDto.email} no existe`)

    const payload = { email: user.email }
    const token = await jwtAdapter.generateJWT( payload )

    await this.emailSender.sendRecoverPasswordEmail({
      to: user.email,
      subject: 'ClassConnect - Recupera tu cuenta'
    }, token as string )

  }

  async changeAccountPassword( changePasswordDto: ChangePasswordDto ): Promise<{ user: UserEntity, token: string }> {

    const { newPassword, userEmail } = changePasswordDto

    const user = await this.userRepo.findUserByEmail( userEmail )
    if ( !user ) throw CustomError.notFound(`El usuario con email: ${userEmail} no existe`)

    const newPasswordHashed = bcryptAdapter.hash( newPassword )
    await this.userRepo.updateUser( user.id, { password: newPasswordHashed } )

    const payload = {
      id: user.id,
      role: user.role,
      email: user.email
    }
    const token = await jwtAdapter.generateJWT( payload )

    await this.emailSender.sendChangedPasswordEmail({
      subject: 'ClassConnnect - Cambio de contraseña',
      to: user.email,
    })

    return { 
      user,
      token: token as string 
    }
  }

  async validateAccount( dto: ValidateAccountDto, sessionInfo: SessionInfo ): Promise<{ user: UserEntity, token: unknown }> {
    
    const user = await this.userRepo.findUserByEmail( dto.email )
    if (!user) throw CustomError.notFound(`El usuario con email: ${dto.email} no existe`)

    if ( user.isAccountVerified ) throw CustomError.badRequest('El usuario ya ha sido verificado')

    const statusValidationCode = await this.validateCodeService.verifyCodeStatus( user.id, dto.code )
    
    if ( statusValidationCode === StatusVerificationCode.Expired )
      throw CustomError.badRequest(`El código ha expirado. Genera uno nuevo`)

    if ( statusValidationCode === StatusVerificationCode.Invalid ) 
      throw CustomError.unauthorized('El código ingresado no es correcto')

    const userUpdated = await this.userRepo.updateUser( user.id, { isAccountVerified: true } )
    
    await this.loginSessionService.registerLoginSession({ userId: user.id, ...sessionInfo })

    // TODO: Implementar welcomeEmail template
    // await this.emailSender.sendWelcomeEmail({
    //   subject: 'ClassConnnect - Cuenta validada correctamente',
    //   to: userUpdated.email,
    // })

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

    const code = await this.validateCodeService.generateValidationCode( user.id )
    const token = await jwtAdapter.generateJWT({ id: user.id, email: user.email })

    await this.emailSender.sendValidationCode({
      to: user.email,
      subject: 'ClassConnect - Valida tu correo electrónico',   
    }, code, token as string )

  }

  async getUserLoginSessions( userId: string ): Promise<LoginSessionEntity[] | null> {

    const user = await this.userRepo.findById( userId )
    if ( !user ) throw CustomError.notFound(`El usuario con id: ${userId} no existe`)
    
    const loginSession = await this.loginSessionService.getLoginSessionsById( userId )
    return loginSession
  }
 
  async renewToken( user: UserEntity ): Promise<{ user: UserEntity, token: unknown }> {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role
    }

    const newToken = await jwtAdapter.generateJWT( payload )

    return {
      user: user,
      token: newToken
    }
  }

}