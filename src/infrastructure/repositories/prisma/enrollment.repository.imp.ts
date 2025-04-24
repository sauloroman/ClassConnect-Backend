import { UpdateEnrollmentDto } from "../../../domain/dtos/classroom/update-enrollment.dto";
import { EnrollmentEntity } from "../../../domain/entities";
import { EnrollmentRepository } from "../../../domain/repositories";

import { prismaClient } from "../../database/prisma/prisma-client";

export class PrismaEnrollmentRepository implements EnrollmentRepository {

  async isStudentInClassroom(studentId: string, classroomId: string ): Promise<boolean> {
    const existing = await prismaClient.enrollment.findFirst({ where: { studentId, classroomId }})
    if ( !existing ) return false
    return true
  }

  async joinStudent(studentId: string, classroomId: string): Promise<EnrollmentEntity> {
    const enrollment = await prismaClient.enrollment.create({ data: { studentId, classroomId } })
    const enrollmentEntity = EnrollmentEntity.fromObject( enrollment )
    return enrollmentEntity
  }

  async updateEnrollment(enrollmentId: string, updateEnrollmentDto: UpdateEnrollmentDto): Promise<EnrollmentEntity> {
    const enrollmentUpdated = await prismaClient.enrollment.update({ 
      where: { id: enrollmentId }, 
      data: { ...updateEnrollmentDto } 
    })

    return EnrollmentEntity.fromObject( enrollmentUpdated )
  }

  async getStudentsOfClassroom( classroomId: string, offset: number, limit: number ): Promise<any[]> {

    const students = await prismaClient.enrollment.findMany({
      where: { classroomId },
      skip: offset,
      take: limit,
      include: { student: true }
    })  

    return students
  }

  async countStudentsInClassroom( classroomId: string ): Promise<number> {
    return await prismaClient.enrollment.count({ where: { classroomId }})
  }

}