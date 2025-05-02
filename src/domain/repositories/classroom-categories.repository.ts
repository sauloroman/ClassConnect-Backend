import { ClassroomCategoryEntity } from "../entities";

export abstract class ClassroomCategoriesRepository {
  abstract saveRecord( classroomId: string, classroomCategoryId: string ): Promise<boolean>
  abstract getCategoriesByClassroomId( classroomId: string ): Promise<ClassroomCategoryEntity[]>
}