export abstract class ClassroomCategoriesRepository {
  abstract saveRecord( classroomId: string, classroomCategoryId: string ): Promise<boolean>
}