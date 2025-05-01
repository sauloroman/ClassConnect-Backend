import { ClassroomCategoryEntity } from "../entities";

export abstract class ClassroomCategoryRepository {
  abstract getAllClassroomCategory(): Promise<ClassroomCategoryEntity[]>
  abstract getClassroomCategoryByName( categoryName: string ): Promise<ClassroomCategoryEntity | null>
}