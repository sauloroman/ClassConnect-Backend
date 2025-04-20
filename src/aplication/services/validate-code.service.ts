import { UserRepository } from "../../domain/repositories/user.repository";
import { ValidateCodeRepository } from "../../domain/repositories/validate-code.reposity";
import { EmailService } from "../../domain/services/email.service";
import { CustomError } from "../../shared/errors";
import { cryptoAdapter } from "../../shared/plugins";

interface ValidateCodeServiceOptions {
  duration: number,
  validateCodeRepo: ValidateCodeRepository,
  userRepo: UserRepository,
  emailSender: EmailService,
}

export class ValidateCodeService {

  private readonly activeCodeDurationInMinutes: number
  private readonly validateCodeRepo: ValidateCodeRepository
  private readonly userRepo: UserRepository
  private readonly emailSender: EmailService

  constructor({ emailSender, userRepo, validateCodeRepo, duration }: ValidateCodeServiceOptions){
    this.validateCodeRepo = validateCodeRepo
    this.emailSender = emailSender
    this.userRepo = userRepo
    this.activeCodeDurationInMinutes = duration
  }

  async generateValidateCode( userId: string ): Promise<void> {

    const code = cryptoAdapter.generateSecureCode(5)
    
    await this.validateCodeRepo.deleteByUserId( userId )
    await this.validateCodeRepo.createCode({ code, userId })

    const user = await this.userRepo.findById( userId )
    if ( !user ) throw CustomError.notFound(`El usuario con id: ${userId} no existe`)

    await this.emailSender.sendValidationCode({
      to: user?.email,
      subject: 'ClassConnect - Valida tu correo electrónico',   
    }, code )
  }

  async isCodeValid( userId: string, code: string ): Promise<boolean> {

    const latestCode = await this.validateCodeRepo.getLatestCodeByUserId( userId )
    if ( !latestCode ) return false

    const diffMs = new Date().getTime() - latestCode.createdAt.getTime()
    const diffMin = diffMs / 1000 / 60

    return latestCode.code === code && diffMin < this.activeCodeDurationInMinutes

  }

}