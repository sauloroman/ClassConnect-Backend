import { ClassroomEntity } from "../../domain/entities";
import { CreateClassroomDto } from '../../domain/dtos/classroom';
import { PaginationDto } from "../../domain/dtos/shared";
import { ClassroomRepository } from "../../domain/repositories";
import { QRCodeService, FileUploadService } from "../../domain/services";

import { getIdAdapter } from "../../shared/plugins";
import { CustomError } from "../../shared/errors";
import { buildPaginationMeta, extractClassroomUUIDFromUrl } from "../../shared/utils";
import { UploadedFile } from "express-fileupload";

interface ClassroomServiceOptions {
  classroomRepo: ClassroomRepository
  qrCodeService: QRCodeService,
  fileUploadService: FileUploadService
}

export class ClassroomService {

  private readonly classroomRepo: ClassroomRepository
  private readonly qrCodeService: QRCodeService
  private readonly fileUploadService: FileUploadService

  constructor( { classroomRepo, qrCodeService, fileUploadService }: ClassroomServiceOptions ) {
    this.classroomRepo = classroomRepo
    this.qrCodeService = qrCodeService
    this.fileUploadService = fileUploadService
  }

  public async createClassroom ( createClassroomDto: CreateClassroomDto, userId: string ): Promise<ClassroomEntity> {

    let code: string = '';
    do {
      code = getIdAdapter.classroomCode()
    } while( await this.classroomRepo.existsCode( code ) )

    const classroom = await this.classroomRepo.createClassroom({
      ...createClassroomDto,
      code,
      instructorId: userId
    })

    return classroom
  }

  public async getClassroomsByInstructorId( paginationDto: PaginationDto, instructorId: string ) {

    const { limit, page } = paginationDto
    const skip = ( page - 1 ) * limit

    const [ classroomsOfInstructor, totalClassroomsOfInstructor ] = await Promise.all([
      await this.classroomRepo.getClassroomsByInstructorId( 
        instructorId, 
        skip, 
        limit 
      ),
      await this.classroomRepo.countClassroomsOfInstructor( instructorId )
    ])
    
    return buildPaginationMeta( classroomsOfInstructor, { 
      page, 
      limit, 
      totalItems: totalClassroomsOfInstructor 
    })

  }

  public async uploadImageForClassroom( image: UploadedFile, classroomId: string ): Promise<ClassroomEntity> {

    const classroom = await this.classroomRepo.getClassroomById( classroomId )
    if ( !classroom ) throw CustomError.notFound(`El classroom con id ${classroomId} no existe`)

    if ( classroom.img ) {
      const imageUUID = extractClassroomUUIDFromUrl( classroom.img )
      await this.fileUploadService.destroyFile(
        `classconnect/classrooms/${classroom.id}/${imageUUID}`,
        'image'
      )
    }

    const classroomImageUrl = await this.fileUploadService.uploadFile( 
      image, 
      `/classconnect/classrooms/${classroom.id}`,
      ['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif'],
      'image'
    )

    const classroomEntity = await this.classroomRepo.updateClassroom( 
      classroom.id, 
      { img: classroomImageUrl } 
    )

    return classroomEntity

  }

  public async createQRCodeForClassroom( classroomId: string ): Promise<string> {

    const classroom = await this.classroomRepo.getClassroomById( classroomId )
    if ( !classroom ) throw CustomError.notFound(`El classroom con id ${classroomId} no existe`)

    if ( classroom.qrCode ) {
      const qrCodeUUID = extractClassroomUUIDFromUrl( classroom.qrCode )
      await this.qrCodeService.deleteQRCodeInCloud( `classconnect/classrooms/${classroom.id}/${qrCodeUUID}`)
    }

    const qrCodeData =  {
      classroom: classroom.id,
      title: classroom.title
    }
    const { nameQRCode, pathQRCode } = await this.qrCodeService.createQRCode( qrCodeData )
    const qrCodeUrl = await this.qrCodeService.uploadQRCode( pathQRCode, `/classconnect/classrooms/${classroom.id}`)
    this.qrCodeService.deleteQRCodeInServer( nameQRCode )

    await this.classroomRepo.updateClassroom( classroom.id, { qrCode: qrCodeUrl } )

    return qrCodeUrl
  }


}
