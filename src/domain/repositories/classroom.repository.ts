import { IClassroom } from "../interfaces";
import { ClassroomEntity } from "../entities";

export abstract class ClassroomRepository {

  abstract createClassroom( classroom: IClassroom ): Promise<ClassroomEntity>
  abstract existsCode( code: string ): Promise<boolean>

}