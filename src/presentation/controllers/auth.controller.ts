import { Request, Response } from 'express';
import { AuthService } from '../../aplication/services';
import { CustomError } from '../../shared/errors';
import { ChangePasswordDto, ForgotPasswordDto, LoginDto, ResentValidateCodeDto, ValidateAccountDto } from '../../domain/dtos/auth';

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

    const { sessionInfo } = req.body
    const [dto, errorMessage] = ValidateAccountDto.create(req.body);

    if (errorMessage) {
      return res.status(400).json({ ok: false, error: errorMessage });
    }

    this.authService
      .validateAccount(dto!, sessionInfo)
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
  }

  public forgotPassword = ( req: Request, res: Response ): any => {

    const [ dto, errorMessage ] = ForgotPasswordDto.create( req.body )

    if (errorMessage) {
      return res.status(400).json({ ok: false, error: errorMessage });
    }

    this.authService.forgotPassword( dto! )
      .then( () => {
        res.status(200).json({ 
          ok: true, 
          msg: 'Revisa tu correo electrónico y sigue las instrucciones para recuperar tu contraseña',
        }) 
      })
      .catch( err => this.handleErrorResponse( err, res ) )

  }

  public changePassword = ( req: Request, res: Response ): any => {

    const [ dto, errorMessage ] = ChangePasswordDto.create( req.body )

    if (errorMessage) {
      return res.status(400).json({ ok: false, error: errorMessage });
    }

    this.authService.changeAccountPassword( dto! )
      .then( () => res.status(200).json({ ok: true, msg: 'La contraseña se ha cambiado correctamente. Inicie sesión.'}))
      .catch( err => this.handleErrorResponse( err, res ) )

  }

  public getUserLoginSessions = (req: Request, res: Response): any => {

    const { userId } = req.params

    this.authService.getUserLoginSessions( userId )
      .then( (data) => {
        res.status(200).json({
          ok: true,
          msg: `Inicios de sesion del usuario: ${userId}`,
          loginSessions: data
        })
      })
      .catch( err => this.handleErrorResponse( err, res ))

  } 

  public renewToken = (req: Request, res: Response): any => {

    const { user } = req.body

    this.authService.renewToken( user )
      .then( ({ user, token }) => {
        res.status(200).json({
          ok: true,
          user,
          token
        })
      })
      .catch( err => this.handleErrorResponse( err, res ) )

  }

}
