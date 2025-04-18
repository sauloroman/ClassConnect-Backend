import { CreateUserDto } from "../dtos/user/create-user.dto";
import { UserEntity } from "../entities/user.entity";

export abstract class UserRepository {

  abstract createUser( dto: CreateUserDto ): Promise<UserEntity>

}