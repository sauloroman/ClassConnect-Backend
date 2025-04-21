import { CreateUserDto, UpdateUserDto } from '../../../domain/dtos/user';
import { UserEntity } from '../../../domain/entities/user.entity';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { prismaClient } from '../../database/prisma/prisma-client';

export class PrismaUserRepository implements UserRepository {

  async createUser(dto: CreateUserDto): Promise<UserEntity> {
    const userCreated = await prismaClient.users.create({data: { ...dto }})
    const user = UserEntity.fromObject( userCreated )
    return user
  }

  async findUserByEmail(email: string): Promise<UserEntity | null> {
    const possibleUser = await prismaClient.users.findUnique({ where: { email }})
    
    if ( !possibleUser ) return null

    const user = UserEntity.fromObject( possibleUser )
    return user
  }

  async findById(id: string): Promise<UserEntity | null> {
    const possibleUser = await prismaClient.users.findUnique({ where: { id }})

    if ( !possibleUser ) return null
    
    const user = UserEntity.fromObject( possibleUser )
    return user
  }

  async updateUser(id: string, dto: Partial<UpdateUserDto>): Promise<UserEntity> {    
    const userUpdated = await prismaClient.users.update({ where: { id }, data: { ...dto }})
    const user = UserEntity.fromObject( userUpdated )
    return user
  }

  async deleteUserById(id: string): Promise<void> {
    await prismaClient.users.delete({ where: { id } })
  }

}