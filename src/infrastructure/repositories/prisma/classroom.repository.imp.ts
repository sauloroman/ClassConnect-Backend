import { ClassroomEntity } from "../../../domain/entities";
import { ClassroomRepository } from "../../../domain/repositories";
import { IClassroom } from "../../../domain/interfaces";
import { prismaClient } from "../../database/prisma/prisma-client";
import { UpdateClassroomDto } from "../../../domain/dtos/classroom";

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

  async getClassroomById(id: string): Promise<ClassroomEntity | null> {
    const classroom = await prismaClient.classroom.findUnique({ where: { id }})
    if ( !classroom ) return null
    return ClassroomEntity.fromObject( classroom )
  } 

  async getClassroomByCode(code: string): Promise<ClassroomEntity | null> {
    const classroom = await prismaClient.classroom.findFirst({ where: { code }})
    if ( !classroom ) return null
    return ClassroomEntity.fromObject( classroom )
  }

  async updateClassroom( id: string, updateClassroomDto: UpdateClassroomDto): Promise<ClassroomEntity> {
    const classroomUpdated = await prismaClient.classroom.update({ 
      where: { id }, 
      data: { ...updateClassroomDto }
    })
    return ClassroomEntity.fromObject( classroomUpdated )
  }

  async getClassroomsByInstructorId(
    instructorId: string, 
    offset: number, 
    limit: number
  ): Promise<ClassroomEntity[]> {
    
    const classrooms = await prismaClient.classroom.findMany({ 
      where: { instructorId },
      skip: offset,
      take: limit,
      include: {
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    })

    console.log(classrooms)

    const classroomsEntities = classrooms.map( ClassroomEntity.fromObject )
    return classroomsEntities

  }

  async countClassroomsOfInstructor(instructorId: string): Promise<number> {
    return await prismaClient.classroom.count({ where: {instructorId} })
  }

}