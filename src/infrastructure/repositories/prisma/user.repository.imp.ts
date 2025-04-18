import { CreateUserDto } from '../../../domain/dtos/user/create-user.dto';
import { UserEntity } from '../../../domain/entities/user.entity';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { prismaClient } from '../../database/prisma/prisma-client';

export class PrismaUserRepository implements UserRepository {

  async createUser(dto: CreateUserDto): Promise<UserEntity> {
    const userCreated = await prismaClient.users.create({data: { ...dto }})
    const user = UserEntity.fromObject( userCreated )
    return user
  }

}