import { ClassroomRepository } from "../../domain/repositories";
import { CreateClassroomDto } from '../../domain/dtos/classroom';
import { QRCodeService } from "../../domain/services/qr-code.service";
import { ClassroomEntity } from "../../domain/entities";
import { getIdAdapter } from "../../shared/plugins";
import { CustomError } from "../../shared/errors";

interface ClassroomServiceOptions {
  classroomRepo: ClassroomRepository
  qrCodeService: QRCodeService,
}

export class ClassroomService {

  private readonly classroomRepo: ClassroomRepository
  private readonly qrCodeService: QRCodeService

  constructor( { classroomRepo, qrCodeService }: ClassroomServiceOptions ) {
    this.classroomRepo = classroomRepo
    this.qrCodeService = qrCodeService
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

  public async createQRCodeForClassroom( classroomId: string ): Promise<string> {

    const classroom = await this.classroomRepo.getClassroomById( classroomId )
    if ( !classroom ) throw CustomError.notFound(`El classroom con id ${classroomId} no existe`)

    const qrCodeData =  {
      classroom: classroom.id,
      title: classroom.title
    }

    const qrCodeUrl = await this.qrCodeService.generateQRCodeUrl<{classroom: string, title: string}>(
      qrCodeData,
      `/classconnect/classrooms/${classroom.id}` 
    )

    await this.classroomRepo.updateClassroom( classroom.id, { qrCode: qrCodeUrl } )

    return qrCodeUrl

  }


}
