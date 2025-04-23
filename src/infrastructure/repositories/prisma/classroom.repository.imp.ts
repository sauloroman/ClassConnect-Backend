import { ClassroomEntity } from "../../../domain/entities";
import { ClassroomRepository } from "../../../domain/repositories";
import { IClassroom } from "../../../domain/interfaces";
import { prismaClient } from "../../database/prisma/prisma-client";

export class PrismaClassroomRepository implements ClassroomRepository {

  async createClassroom( classroom: IClassroom ): Promise<ClassroomEntity> {
    const classroomCreated = await prismaClient.classroom.create({ data: { ...classroom } })
    const classroomEntity = ClassroomEntity.fromObject( classroomCreated )
    return classroomEntity
  }

  async existsCode(code: string): Promise<boolean> {
    const existing = await prismaClient.classroom.findFirst({ where: { code }})
    if ( !existing ) return false
    return true
  }

}