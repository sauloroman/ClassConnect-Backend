import { ClassroomRepository } from "../../domain/repositories";
import { CreateClassroomDto } from '../../domain/dtos/classroom/create-classroom.dto';
import { ClassroomEntity } from "../../domain/entities";
import { getClassroomIdAdapter } from "../../shared/plugins";

interface ClassroomServiceOptions {
  classroomRepo: ClassroomRepository
}

export class ClassroomService {

  private readonly classroomRepo: ClassroomRepository

  constructor( { classroomRepo }: ClassroomServiceOptions ) {
    this.classroomRepo = classroomRepo
  }

  public async createClassroom ( createClassroomDto: CreateClassroomDto, userId: string ): Promise<ClassroomEntity> {

    let code: string = '';
    do {
      code = getClassroomIdAdapter.generateCode()
    } while( await this.classroomRepo.existsCode( code ) )

    const classroom = await this.classroomRepo.createClassroom({
      ...createClassroomDto,
      code,
      instructorId: userId
    })

    return classroom

  }

}