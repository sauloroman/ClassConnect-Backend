import { CreateLoginSessionDto } from "../../../domain/dtos/login-session";
import { LoginSessionEntity } from "../../../domain/entities";
import { LoginSessionRepository } from "../../../domain/repositories";
import { prismaClient } from "../../database/prisma/prisma-client";

export class PrismaLoginSessionRepository implements LoginSessionRepository {

  async save(createLoginSessionDto: CreateLoginSessionDto): Promise<LoginSessionEntity> {
    const loginSessionCreated = await prismaClient.loginSession.create({ data: { ...createLoginSessionDto }})
    const loginSessionEntity = LoginSessionEntity.fromObject( loginSessionCreated )
    return loginSessionEntity
  }

  async getRecordsByUserId(userId: string): Promise<LoginSessionEntity[] | null> {
    const records = await prismaClient.loginSession.findMany({ where: { userId }})
    if ( records.length === 0 ) return []
    const recordsEntity = records.map( LoginSessionEntity.fromObject )
    return recordsEntity
  }
  
}