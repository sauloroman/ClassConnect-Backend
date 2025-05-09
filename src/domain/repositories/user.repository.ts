import { UpdateUserDto, CreateUserDto } from "../dtos/user";
import { UserEntity } from '../entities';

export abstract class UserRepository {
  abstract createUser( dto: CreateUserDto ): Promise<UserEntity>
  abstract findUserByEmail( email: string ): Promise<UserEntity | null>
  abstract findById( id: string ): Promise<UserEntity | null>
  abstract updateUser( id: string, data: UpdateUserDto ): Promise<UserEntity>
  abstract deleteUserById( id: string ): Promise<void>
  abstract getAllUsers( offset: number, limit: number ): Promise<UserEntity[]> 
  abstract countUsers(): Promise<number>
}