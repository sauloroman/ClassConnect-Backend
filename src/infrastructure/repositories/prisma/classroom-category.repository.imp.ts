import { ClassroomCategoryEntity } from "../../../domain/entities";
import { ClassroomCategoryRepository } from "../../../domain/repositories";
import { prismaClient } from "../../database/prisma/prisma-client";

export class PrismaClassroomCategoryRepository implements ClassroomCategoryRepository {

  async getAllClassroomCategory(): Promise<ClassroomCategoryEntity[]> {
    const classroomCategories = await prismaClient.categories.findMany()
    const classroomCategoriesEntity = classroomCategories.map( ClassroomCategoryEntity.fromObject )
    return classroomCategoriesEntity
  }

  async getClassroomCategoryByName(categoryName: string): Promise<ClassroomCategoryEntity | null> {
    const category = await prismaClient.categories.findFirst({ where: {categoryName} })
    if ( !category ) return null
    const categoryEntity = ClassroomCategoryEntity.fromObject( category )
    return categoryEntity
  }
  
}