import { CreateUserDto, UpdateUserDto } from '../../domain/dtos/user';
import { PaginationDto } from '../../domain/dtos/shared';
import { UserEntity } from '../../domain/entities';
import { UserRepository } from '../../domain/repositories';
import { EmailService } from '../../domain/services/email.service';
import { ValidateCodeService } from './validate-code.service';
import { CustomError } from '../../shared/errors';
import { bcryptAdapter } from '../../shared/plugins';
import { PaginationResult } from '../../domain/interfaces/pagination-result.interface';
import { buildPaginationMeta } from '../../shared/utils/pagination.util';

interface UserServiceOptions {
  userRepo: UserRepository;
  validateCodeService: ValidateCodeService;
  emailSender: EmailService;
}

export class UserService {
  private readonly userRepo: UserRepository;
  private readonly validateCodeService: ValidateCodeService;
  private readonly emailSender: EmailService;

  constructor({ userRepo, emailSender, validateCodeService }: UserServiceOptions) {
    this.userRepo = userRepo;
    this.emailSender = emailSender
    this.validateCodeService = validateCodeService;
  }

  async getUsers( paginationDto: PaginationDto ): Promise<PaginationResult<UserEntity>> {

    const { page, limit } = paginationDto
    const skip = ( page - 1 ) * limit

    const [ totalUsers, users ] = await Promise.all([
      await this.userRepo.countUsers(),
      await this.userRepo.getAllUsers( skip, limit )
    ])

    return buildPaginationMeta( users, { page, limit, totalItems: totalUsers })
  } 

  async createUser(dto: CreateUserDto): Promise<UserEntity> {
    const existing = await this.userRepo.findUserByEmail(dto.email);

    if (existing) {
      throw CustomError.badRequest(
        `El usuario con email: ${dto.email} ya existe. Intente con otro correo.`
      );
    }

    const user = await this.userRepo.createUser(dto);
    user.password = bcryptAdapter.hash(user.password);
    await this.userRepo.updateUser(user.id, { password: user.password });

    const code = await this.validateCodeService.generateValidationCode(user.id);

    await this.emailSender.sendValidationCode({
      to: user.email,
      subject: 'ClassConnect - Valida tu correo electrónico',   
    }, code )

    return { 
      ...user,
      password: ''
    }
  }

  async updateUserInfo( id: string, updateUserDto: UpdateUserDto ): Promise<UserEntity> {
    const { password, isActive, isAccountVerified, ...restUpdateUserDto } = updateUserDto
    const userUpdated = await this.userRepo.updateUser( id, restUpdateUserDto )    
    return userUpdated
  }

  async deactivateUser( id: string ): Promise<void> {
    const user = await this.userRepo.findById( id )
    if ( !user ) throw CustomError.notFound(`El usuario con id: ${id} no existe`)
    await this.userRepo.updateUser( id, { isActive: false } )
  }

}


