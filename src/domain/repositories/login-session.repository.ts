import { CreateLoginSessionDto } from "../dtos/login-session";
import { LoginSessionEntity } from "../entities";

export abstract class LoginSessionRepository {
  abstract save( createLoginSessionDto: CreateLoginSessionDto ): Promise<LoginSessionEntity>
}