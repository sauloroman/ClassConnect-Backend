import { CreateValidateCodeDto } from "../dtos/validate-code";
import { ValidateCodeEntity } from "../entities";

export abstract class ValidateCodeRepository {
  abstract createCode( dto: CreateValidateCodeDto ): Promise<ValidateCodeEntity>
  abstract getLatestCodeByUserId( userId: string ): Promise<ValidateCodeEntity | null>
  abstract deleteByUserId( userId: string ): Promise<void>
}