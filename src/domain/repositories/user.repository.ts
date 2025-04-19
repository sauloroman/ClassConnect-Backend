import { UpdateUserDto, CreateUserDto } from "../dtos/user";
import { UserEntity } from '../entities/user.entity';

export abstract class UserRepository {

  abstract createUser( dto: CreateUserDto ): Promise<UserEntity>
  abstract findUserByEmail( email: string ): Promise<UserEntity | null>
  abstract findById( id: string ): Promise<UserEntity | null>
  abstract updateUser( id: string, data: Partial<UpdateUserDto> ): Promise<UserEntity>

}