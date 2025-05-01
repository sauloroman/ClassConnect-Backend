import { ClassroomCategoriesRepository } from "../../../domain/repositories";
import { prismaClient } from "../../database/prisma/prisma-client";

export class PrimaClassroomCategoriesRepository implements ClassroomCategoriesRepository {

  async saveRecord(classroomId: string, classroomCategoryId: string): Promise<boolean> {
    const saved = await prismaClient.classroomCategory.create({ data: {
      categoryId: classroomCategoryId,
      classroomId: classroomId
    }})

    if ( !saved ) return false
    return true
  }

}