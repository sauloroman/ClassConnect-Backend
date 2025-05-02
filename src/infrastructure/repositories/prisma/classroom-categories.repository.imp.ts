import { ClassroomCategoryEntity } from "../../../domain/entities";
import { ClassroomCategoriesRepository } from "../../../domain/repositories";
import { prismaClient } from "../../database/prisma/prisma-client";

export class PrismaClassroomCategoriesRepository implements ClassroomCategoriesRepository {

  async saveRecord(classroomId: string, classroomCategoryId: string): Promise<boolean> {
    const saved = await prismaClient.classroomCategory.create({ data: {
      categoryId: classroomCategoryId,
      classroomId: classroomId
    }})

    if ( !saved ) return false
    return true
  }

  async getCategoriesByClassroomId(classroomId: string): Promise<ClassroomCategoryEntity[]> {
    const categories = await prismaClient.classroomCategory.findMany({
      where: { classroomId },
      include: { category: true }
    })

    return categories.map( c => c.category ) 
  }

}