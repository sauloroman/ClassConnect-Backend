import { CreateValidateCodeDto } from "../../../domain/dtos/validate-code";
import { ValidateCodeEntity } from "../../../domain/entities";
import { ValidateCodeRepository } from "../../../domain/repositories/validate-code.reposity";
import { prismaClient } from "../../database/prisma/prisma-client";

export class PrismaValidateCodeRepository implements ValidateCodeRepository {

  async createCode(dto: CreateValidateCodeDto): Promise<ValidateCodeEntity> {

    const codeGenerated = await prismaClient.validateAccountCode.create({ data: {
      code: dto.code,
      userId: dto.userId,
    }})

    const codeGeneratedEntity = ValidateCodeEntity.fromObject( codeGenerated )
    return codeGeneratedEntity

  }

  async deleteByUserId(userId: string): Promise<void> {
    await prismaClient.validateAccountCode.deleteMany({ where: { userId }})
  }
  
  async getLatestCodeByUserId(userId: string): Promise<ValidateCodeEntity | null> {
    
    const latestCodeRecord = await prismaClient.validateAccountCode.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })

    if ( !latestCodeRecord ) return null

    const codeEntity = ValidateCodeEntity.fromObject( latestCodeRecord )
    return codeEntity
  }

}