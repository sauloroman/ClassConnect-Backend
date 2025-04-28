import { ValidateCodeRepository } from "../../domain/repositories";
import { StatusVerificationCode } from "../../shared/enums";
import { cryptoAdapter } from "../../shared/plugins";

interface ValidateCodeServiceOptions {
  duration: number,
  validateCodeRepo: ValidateCodeRepository,
}

export class ValidateCodeService {

  private readonly activeCodeDurationInMinutes: number
  private readonly validateCodeRepo: ValidateCodeRepository

  constructor({ validateCodeRepo, duration }: ValidateCodeServiceOptions){
    this.validateCodeRepo = validateCodeRepo
    this.activeCodeDurationInMinutes = duration
  }

  async generateValidationCode( userId: string ): Promise<string> {
    const code = cryptoAdapter.generateSecureCode(5)
    await this.validateCodeRepo.deleteByUserId( userId )
    await this.validateCodeRepo.createCode({ code, userId })
    return code
  }

  async verifyCodeStatus( userId: string, code: string ): Promise<StatusVerificationCode> {
    const latestCode = await this.validateCodeRepo.getLatestCodeByUserId( userId )
    if ( !latestCode ) return StatusVerificationCode.Invalid

    if ( latestCode.code !== code ) return StatusVerificationCode.Invalid
    
    const diffMs = new Date().getTime() - latestCode.createdAt.getTime()
    const diffMin = diffMs / 1000 / 60

    if ( diffMin > this.activeCodeDurationInMinutes ) return StatusVerificationCode.Expired

    return StatusVerificationCode.Valid
  }

} 