import { ClassroomEntity, EnrollmentEntity, UserEntity } from "../../domain/entities";
import { CreateClassroomDto } from '../../domain/dtos/classroom';
import { PaginationDto } from "../../domain/dtos/shared";
import { ClassroomRepository, EnrollmentRepository } from "../../domain/repositories";
import { QRCodeService, FileUploadService } from "../../domain/services";

import { getIdAdapter } from "../../shared/plugins";
import { CustomError } from "../../shared/errors";
import { buildPaginationMeta, extractClassroomUUIDFromUrl } from "../../shared/utils";
import { UploadedFile } from "express-fileupload";
import { JoinStudentDto } from '../../domain/dtos/classroom/join-student.dto';
import { PaginationResult } from "../../domain/interfaces";

interface ClassroomServiceOptions {
  classroomRepo: ClassroomRepository
  enrollmentRepo: EnrollmentRepository,
  qrCodeService: QRCodeService,
  fileUploadService: FileUploadService
}

export class ClassroomService {

  private readonly classroomRepo: ClassroomRepository
  private readonly enrollmentRepo: EnrollmentRepository
  private readonly qrCodeService: QRCodeService
  private readonly fileUploadService: FileUploadService

  constructor( { classroomRepo, enrollmentRepo, qrCodeService, fileUploadService }: ClassroomServiceOptions ) {
    this.classroomRepo = classroomRepo
    this.enrollmentRepo = enrollmentRepo
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

    const enrollment = await this.enrollmentRepo.joinStudent( userId, classroom.id )
    await this.enrollmentRepo.updateEnrollment( enrollment.id, { progress: 100.0 } )

    return classroom
  }

  public async getClassroomsByInstructorId( paginationDto: PaginationDto, instructorId: string ): Promise<PaginationResult<ClassroomEntity>> {

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

  public async joinStudentToClassroom( joinStudentDto: JoinStudentDto, userId: string ): Promise<EnrollmentEntity> {

    const { code } = joinStudentDto

    const classroom = await this.classroomRepo.getClassroomByCode( code )
    if ( !classroom ) throw CustomError.notFound(`El classroom con codigo ${code} no existe`)

    if ( await this.enrollmentRepo.isStudentInClassroom( userId, classroom.id ) ) 
      throw CustomError.badRequest('El estudiante ya pertenece al aula')

    return await this.enrollmentRepo.joinStudent( userId, classroom.id )
  } 

  public async getStudentsInClassroom( paginationDto: PaginationDto, classroomId: string ) {

    const { page, limit } = paginationDto
    const skip = ( page - 1 ) * limit

    const [ studentsInClassroom, totalStudentsInClassroom ] = await Promise.all([
      await this.enrollmentRepo.getStudentsOfClassroom( classroomId, skip, limit ),
      await this.enrollmentRepo.countStudentsInClassroom( classroomId )
    ])

    const studentsEntityInClassroom = studentsInClassroom.map( studentInClassroom => {
      studentInClassroom.student.password = ''
      return studentInClassroom
    })

    return buildPaginationMeta( studentsEntityInClassroom, {
      limit,
      page,
      totalItems: totalStudentsInClassroom
    })

  } 


}
