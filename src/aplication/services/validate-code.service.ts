import { ValidateCodeRepository } from "../../domain/repositories/validate-code.reposity";
import { EmailService } from "../../domain/services/email.service";
import { StatusVerificationCode } from "../../shared/enums";
import { cryptoAdapter } from "../../shared/plugins";

interface ValidateCodeServiceOptions {
  duration: number,
  validateCodeRepo: ValidateCodeRepository,
  emailSender: EmailService,
}

export class ValidateCodeService {

  private readonly activeCodeDurationInMinutes: number
  private readonly validateCodeRepo: ValidateCodeRepository
  private readonly emailSender: EmailService

  constructor({ emailSender, validateCodeRepo, duration }: ValidateCodeServiceOptions){
    this.validateCodeRepo = validateCodeRepo
    this.emailSender = emailSender
    this.activeCodeDurationInMinutes = duration
  }

  async generateValidationCode( userId: string, userEmail: string ): Promise<void> {
    const code = cryptoAdapter.generateSecureCode(5)
    
    await this.validateCodeRepo.deleteByUserId( userId )
    await this.validateCodeRepo.createCode({ code, userId })

    await this.emailSender.sendValidationCode({
      to: userEmail,
      subject: 'ClassConnect - Valida tu correo electrónico',   
    }, code )
  }

  async verifyCodeStatus( userId: string, code: string ): Promise<StatusVerificationCode> {
    const latestCode = await this.validateCodeRepo.getLatestCodeByUserId( userId )
    if ( !latestCode ) return StatusVerificationCode.Invalid

    const diffMs = new Date().getTime() - latestCode.createdAt.getTime()
    const diffMin = diffMs / 1000 / 60

    if ( diffMin > this.activeCodeDurationInMinutes ) return StatusVerificationCode.Expired
    if ( latestCode.code !== code ) return StatusVerificationCode.Invalid

    return StatusVerificationCode.Valid
  }

} 