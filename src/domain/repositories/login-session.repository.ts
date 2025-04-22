import { CreateLoginSessionDto } from "../dtos/login-session";
import { LoginSessionEntity } from "../entities";

export abstract class LoginSessionRepository {
  abstract save( createLoginSessionDto: CreateLoginSessionDto ): Promise<LoginSessionEntity>
  abstract getRecordsByUserId( userId: string ): Promise<LoginSessionEntity[] | null>
}