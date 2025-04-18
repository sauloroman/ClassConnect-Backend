import { Request, Response } from "express";
import { UserService } from "../../aplication/services/user.service";
import { CreateUserDto } from "../../domain/dtos/user/create-user.dto";

export class UserControllers {

  constructor(
    private readonly userService: UserService
  ){}

  public postUser( req: Request, res: Response ): any {

    const [ dto, errorMessage ] = CreateUserDto.create( req.body )

    if ( errorMessage ) {
      return res.status(400).json({ error: errorMessage })
    }

    // this.userService.

  }


}