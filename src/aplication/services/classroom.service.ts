import { ClassroomCategoryEntity, ClassroomEntity, EnrollmentEntity, UserEntity } from "../../domain/entities";
import { CreateClassroomDto } from '../../domain/dtos/classroom';
import { PaginationDto } from "../../domain/dtos/shared";
import { ClassroomCategoryRepository, ClassroomRepository, EnrollmentRepository, ClassroomCategoriesRepository } from "../../domain/repositories";
import { QRCodeService, FileUploadService } from "../../domain/services";
import { getIdAdapter } from "../../shared/plugins";
import { CustomError } from "../../shared/errors";
import { buildPaginationMeta, extractClassroomUUIDFromUrl } from "../../shared/utils";
import { UploadedFile } from "express-fileupload";
import { JoinStudentDto } from '../../domain/dtos/classroom/join-student.dto';
import { PaginationResult } from "../../domain/interfaces";

interface ClassroomServiceOptions {
  classroomRepo: ClassroomRepository,
  classroomCategoryRepo: ClassroomCategoryRepository,
  classroomCategoriesRepo: ClassroomCategoriesRepository,
  enrollmentRepo: EnrollmentRepository,
  qrCodeService: QRCodeService,
  fileUploadService: FileUploadService
}

export class ClassroomService {

  private readonly classroomRepo: ClassroomRepository
  private readonly classroomCategoryRepo: ClassroomCategoryRepository
  private readonly classroomCategoriesRepo: ClassroomCategoriesRepository
  private readonly enrollmentRepo: EnrollmentRepository
  private readonly qrCodeService: QRCodeService
  private readonly fileUploadService: FileUploadService

  constructor( { 
    classroomRepo, 
    classroomCategoryRepo, 
    classroomCategoriesRepo,
    enrollmentRepo, 
    qrCodeService, 
    fileUploadService 
  }: ClassroomServiceOptions ) {
    this.classroomRepo = classroomRepo
    this.classroomCategoryRepo = classroomCategoryRepo
    this.classroomCategoriesRepo = classroomCategoriesRepo
    this.enrollmentRepo = enrollmentRepo
    this.qrCodeService = qrCodeService
    this.fileUploadService = fileUploadService
  }

  public async createClassroom ( createClassroomDto: CreateClassroomDto, userId: string ): 
  Promise<PaginationResult<ClassroomEntity & { categories: ClassroomCategoryEntity[] }>> {

    let code: string = '';
    do {
      code = getIdAdapter.classroomCode()
    } while( await this.classroomRepo.existsCode( code ) )

    const { categories, ...restCreateClassroom } = createClassroomDto

    const categoriesEntity = await Promise.all(
      categories.map( async ( category ) => {
        const entity = await this.classroomCategoryRepo.getClassroomCategoryByName( category )
        if ( !entity ) throw CustomError.badRequest(`La categoria "${category}" no es válida`)
        return entity
      })
    )
    
    const classroom = await this.classroomRepo.createClassroom({
      ...restCreateClassroom,
      code,
      instructorId: userId
    })

    await Promise.all([
      categoriesEntity.map( categoryEntity => {
        this.classroomCategoriesRepo.saveRecord( classroom.id, categoryEntity.id )
      })
    ])

    // Inscribir al instructor como estudiante con progreso completo
    const enrollment = await this.enrollmentRepo.joinStudent( userId, classroom.id )
    await this.enrollmentRepo.updateEnrollment( enrollment.id, { progress: 100.0 } )

    return await this.getClassroomsByInstructorId({ page: 1, limit: 8 }, userId, '')
  }

  public async getClassroomsByInstructorId( 
    paginationDto: PaginationDto, 
    instructorId: string,
    category: string,
  ): Promise<PaginationResult<ClassroomEntity & { categories: ClassroomCategoryEntity[] }>> {

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

    const classroomsWithCategories = await Promise.all(
      classroomsOfInstructor.map( async(classroom) => {
        const categories = await this.classroomCategoriesRepo.getCategoriesByClassroomId( classroom.id )

        if ( category && !categories.some( cat => cat.categoryName === category ) ) return null

        return {
          ...classroom,
          categories,
        }
      })
    )

    const filteredClassrooms = classroomsWithCategories.filter( classroom => classroom !== null )
    const totalFiltered = filteredClassrooms.length

    return buildPaginationMeta( filteredClassrooms, { 
      page, 
      limit, 
      totalItems: category ? totalFiltered : totalClassroomsOfInstructor 
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

  public async getCategoriesOfClassrooms(): Promise<ClassroomCategoryEntity[]> {
    const categories = await this.classroomCategoryRepo.getAllClassroomCategory()
    return categories
  }


}
