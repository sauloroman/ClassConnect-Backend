import { Request, Response } from 'express';
import { AuthService } from '../../aplication/services';
import { ValidateUserDto } from '../../domain/dtos/user';
import { CustomError } from '../../shared/errors';
import { LoginDto, ResentValidateCodeDto } from '../../domain/dtos/auth';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private handleErrorResponse(error: unknown, res: Response) {
    if (error instanceof CustomError) {
      return res
        .status(error.statusCode)
        .json({ ok: false, error: error.message });
    }

    console.log(`${error}`);
    res.status(500).json({ ok: false, error });
  }

  public login = ( req: Request, res: Response ): any => {

    const [ dto, errorMessage ] = LoginDto.create( req.body )
    const sessionInfo = req.body.sessionInfo

    if (errorMessage) {
      return res.status(400).json({ ok: false, error: errorMessage });
    }

    this.authService.login( dto!, sessionInfo )
      .then( ({ user, token }) => {
        res.status(200).json({
          ok: true,
          msg: `Bievenido de vuelta ${user.firstName} 🔥`,
          user,
          token,
        })
      })
      .catch( err => this.handleErrorResponse( err, res ))

  }

  public validateAccount = (req: Request, res: Response): any => {
    const [dto, errorMessage] = ValidateUserDto.create(req.body);

    if (errorMessage) {
      return res.status(400).json({ ok: false, error: errorMessage });
    }

    this.authService
      .validateAccount(dto!)
      .then(({ user, token }) => {
        res.status(200).json({
          ok: true,
          msg: 'La cuenta se ha validado exitosamente',
          user,
          token,
        });
      })
      .catch((err) => this.handleErrorResponse(err, res));
  };

  public resendValidationCode = (req: Request, res: Response): any => {
    const [dto, errorMessage] = ResentValidateCodeDto.create(req.body);

    if (errorMessage) {
      return res.status(400).json({ ok: false, error: errorMessage });
    }

    this.authService
      .resentValidationCode(dto?.email!)
      .then(() => {
        res.status(200).json({
          ok: true,
          msg: `El código se ha mandado nuevamente al correo ${dto!.email}`,
        });
      })
      .catch((err) => this.handleErrorResponse(err, res));
  };
}
