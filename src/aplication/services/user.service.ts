import { CreateUserDto } from '../../domain/dtos/user/create-user.dto';
import { UserEntity } from '../../domain/entities';
import { UserRepository } from '../../domain/repositories/user.repository';
import { ValidateCodeRepository } from '../../domain/repositories/validate-code.reposity';
import { CustomError } from '../../shared/errors';
import { bcryptAdapter } from '../../shared/plugins';
import { ValidateCodeService } from './validate-code.service';

interface UserServiceOptions {
  userRepo: UserRepository;
  validateCodeService: ValidateCodeService;
}

export class UserService {
  private readonly userRepo: UserRepository;
  private readonly validateCodeService: ValidateCodeService;

  constructor({ userRepo, validateCodeService }: UserServiceOptions) {
    this.userRepo = userRepo;
    this.validateCodeService = validateCodeService;
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

    await this.validateCodeService.generateValidateCode(user.id);

    return user
  }
}
