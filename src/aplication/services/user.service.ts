import { CreateUserDto } from '../../domain/dtos/user';
import { UserEntity } from '../../domain/entities';
import { UserRepository } from '../../domain/repositories';
import { EmailService } from '../../domain/services/email.service';
import { ValidateCodeService } from './validate-code.service';
import { CustomError } from '../../shared/errors';
import { bcryptAdapter } from '../../shared/plugins';

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

    return user
  }

}


