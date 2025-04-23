import { IClassroom } from "../interfaces";
import { ClassroomEntity } from "../entities";
import { UpdateClassroomDto } from "../dtos/classroom";

export abstract class ClassroomRepository {
  abstract createClassroom( classroom: IClassroom ): Promise<ClassroomEntity>
  abstract existsCode( code: string ): Promise<boolean>
  abstract getClassroomById( classroomId: string ): Promise<ClassroomEntity | null>
  abstract updateClassroom( id: string, updateClassroomDto: UpdateClassroomDto ): Promise<ClassroomEntity>
}