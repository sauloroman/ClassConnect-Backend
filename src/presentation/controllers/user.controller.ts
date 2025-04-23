import { Request, Response } from "express";
import { CreateUserDto, UpdateUserDto } from "../../domain/dtos/user";
import { UserService } from "../../aplication/services/user.service";
import { CustomError } from "../../shared/errors";
import { PaginationDto } from "../../domain/dtos/shared";

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

  public deactivateUser = ( req: Request, res: Response ): any => {

    const { id } = req.params

    this.userService.deactivateUser( id )
      .then(() => {
        res.status(200).json({ ok: true, msg: `La cuenta asociada al usuario ${id} ha sido desactivada` })
      })
      .catch( err => this.handleErrorResponse( err, res )) 

  }

  public updateUserInfo = ( req: Request, res: Response ): any => {

    const dto = UpdateUserDto.create( req.body )
    const { id } = req.params

    this.userService.updateUserInfo( id!, dto )
      .then( ( user ) => {
        res.status(200).json({
          ok: true,
          msg: `El usuario con id ${id} ha sido actualizado`,
          user,
        })
      })
      .catch( err => this.handleErrorResponse( err, res ) )
  }

  public getAllUsers = ( req: Request, res: Response ): any => {

    const { page, limit } = req.query
    const [ paginationDto, errorMessage ] = PaginationDto.create( +page!, +limit! )

    if ( errorMessage ) {
      return res.status(200).json({ ok: false, error: errorMessage })
    }

    this.userService.getUsers( paginationDto! )
      .then( pagination => {
        res.status(200).json({
          ok: true,
          ...pagination
        })
      })
      .catch( err => this.handleErrorResponse( err, res ) )

  }

}