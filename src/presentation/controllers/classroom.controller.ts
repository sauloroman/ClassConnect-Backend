import { Request, Response } from "express";
import { ClassroomService } from "../../aplication/services";
import { CreateClassroomDto } from "../../domain/dtos/classroom";
import { CustomError } from "../../shared/errors";

export class ClassroomController {

  constructor( private readonly classroomService: ClassroomService ){} 

  private handleErrorResponse( error: unknown, res: Response ) {

    if ( error instanceof CustomError ){
      return res.status( error.statusCode ).json({ ok: false, error: error.message })
    }

    console.log(`${error}`)
    res.status(500).json({ ok: false, error })

  }

  public  postClassroom = (req: Request, res: Response): any => {

    const [ dto, errorMessage ] = CreateClassroomDto.create( req.body )
    const { user } = req.body
    
    if ( errorMessage ) {
      return res.status(400).json({ ok: false, error: errorMessage })
    }

    this.classroomService.createClassroom( dto!, user.id )
      .then( data => {
        res.status(201).json({
          ok: true,
          msg: `El classroom ${data.title} ha sido creado correctamente`,
          data,
        })
      })
      .catch( err => this.handleErrorResponse( err, res ) )

  }  

  public getQrCodeForClassroom = ( req: Request, res: Response ): any => {

    const { classroomId } = req.params

    this.classroomService.createQRCodeForClassroom( classroomId )
      .then()
      .catch( err => this.handleErrorResponse( err, res ))

  }

}