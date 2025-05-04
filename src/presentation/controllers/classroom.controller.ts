import { Request, Response } from "express";
import { ClassroomService } from "../../aplication/services";
import { CreateClassroomDto, JoinStudentDto } from "../../domain/dtos/classroom";
import { CustomError } from "../../shared/errors";
import { PaginationDto } from "../../domain/dtos/shared";

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
          msg: `El aula ha sido creada correctamente`,
          data,
        })
      })
      .catch( err => this.handleErrorResponse( err, res ) )
  }  

  public getQrCodeForClassroom = ( req: Request, res: Response ): any => {

    const { classroomId } = req.params

    this.classroomService.createQRCodeForClassroom( classroomId )
      .then( qrCodeUrl => {
        res.status(200).json({
          ok: true,
          msg: 'El codigo qr asociado a este classroom ha sido creado exitosamente',
          qrCodeUrl,
        })
      })
      .catch( err => this.handleErrorResponse( err, res ))

  }

  public uploadImageForClassroom = ( req: Request, res: Response ): any => {

    const { files } = req.body
    const image = files[0]
    const { classroomId } = req.params

    this.classroomService.uploadImageForClassroom( image, classroomId )
      .then( data => {
        res.status(200).json({
          ok: true,
          msg: `La imagen para el classroom ${data.title} se ha subido`,
          data,
        })
      })
      .catch( err => this.handleErrorResponse( err, res ))

  }

  public getClassroomsOfInstructor = ( req: Request, res: Response ): any => {

    const { page, limit, category } = req.query
    const [ paginationDto, errorMessage ] = PaginationDto.create( +page!, +limit! )
    const { instructorId } = req.params

    if ( errorMessage ) {
      return res.status(400).json({ ok: false, error: errorMessage })
    }

    this.classroomService.getClassroomsByInstructorId( 
      paginationDto!, 
      instructorId, 
      category as string 
    )
      .then( pagination => {
        res.status(200).json({
          ok: true,
          ...pagination,
        })
      })
      .catch( err => this.handleErrorResponse( err, res ))
  } 

  public joinStudent = ( req: Request, res: Response ): any => {

    const { user } = req.body
    const [ dto, errorMessage ] = JoinStudentDto.create( req.body )

    if ( errorMessage ) {
      return res.status(400).json({ ok: false, error: errorMessage })
    }
    
    this.classroomService.joinStudentToClassroom( dto!, user.id )
      .then( enrollment => {
        res.status(201).json({
          ok: true,
          msg: `Te has unido exitosamente al grupo`,
          enrollment,
        })
      })
      .catch( err => this.handleErrorResponse( err, res ) )

  } 

  public getStudentInClassroom = ( req: Request, res: Response ): any => {

    const { page, limit } = req.query
    const [ paginationDto, errorMessage ] = PaginationDto.create( +page!, +limit! )
    const { classroomId } = req.params

    if ( errorMessage ) {
      return res.status(400).json({ ok: false, erro: errorMessage })
    }

    this.classroomService.getStudentsInClassroom( paginationDto!, classroomId )
      .then( pagination => {
        res.status(200).json({
          ok: true,
          pagination
        })
      })
      .catch( err => this.handleErrorResponse( err, res ) )

  }

  public getClassroomsCategories = ( _: Request, res: Response ): any => {

    this.classroomService.getCategoriesOfClassrooms()
      .then( (categories) => res.status(200).json({ ok: true, categories: categories }))
      .catch( err => this.handleErrorResponse( err, res ))

  }


}