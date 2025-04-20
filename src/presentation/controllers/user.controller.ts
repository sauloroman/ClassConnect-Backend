import { Request, Response } from "express";
import { CreateUserDto } from "../../domain/dtos/user";
import { UserService } from "../../aplication/services/user.service";
import { CustomError } from "../../shared/errors";

export class UserControllers {

  constructor(
    private readonly userService: UserService
  ){}

  private handleErrorResponse(error: unknown, res: Response ) {

    if ( error instanceof CustomError ) {
      return res.status(error.statusCode).json({ ok: false, error: error.message })
    }

    console.log(`${error}`)
    res.status(500).json({ ok: false, error })
  }
  

  public postUser = ( req: Request, res: Response ): any => {

    const [ dto, errorMessage ] = CreateUserDto.create( req.body )

    if ( errorMessage ) {
      return res.status(400).json({ ok: false, error: errorMessage })
    }

    this.userService.createUser( dto! )
      .then( user => {
        res.status(201).json({
          ok: true,
          msg: 'Usuario creado correctamente',
          user,
        })
      }) 
      .catch( error => this.handleErrorResponse( error, res ) )

  }

}