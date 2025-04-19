import { UserRepository } from "../../domain/repositories/user.repository";
import { ValidateCodeRepository } from "../../domain/repositories/validate-code.reposity";
import { EmailService } from "../../domain/services/email.service";
import { CustomError } from "../../shared/errors";
import { cryptoAdapter } from "../../shared/plugins";

interface ValidateCodeServiceOptions {
  validateCodeRepo: ValidateCodeRepository,
  userRepo: UserRepository,
  emailSender: EmailService,
}

export class ValidateCodeService {

  private readonly activeCodeDurationInMinutes = 10

  private readonly validateCodeRepo: ValidateCodeRepository
  private readonly userRepo: UserRepository
  private readonly emailSender: EmailService

  constructor({ emailSender, userRepo, validateCodeRepo }: ValidateCodeServiceOptions){
    this.validateCodeRepo = validateCodeRepo
    this.emailSender = emailSender
    this.userRepo = userRepo
  }

  async generateValidateCode( userId: string ): Promise<void> {

    const code = cryptoAdapter.generateSecureCode(5)
    
    const user = await this.userRepo.findById(userId)
    if ( !user ) throw CustomError.notFound(`El usuario con id: ${userId} no existe`)

    await this.validateCodeRepo.createCode({ code, userId })

  }

  async isCodeValid( userId: string, code: string ): Promise<boolean> {

    const latestCode = await this.validateCodeRepo.getLatestCodeByUserId( userId )
    if ( !latestCode ) return false

    const diffMs = new Date().getTime() - latestCode.createdAt.getTime()
    const diffMin = diffMs / 1000 / 60

    return latestCode.code === code && diffMin < this.activeCodeDurationInMinutes

  }

}