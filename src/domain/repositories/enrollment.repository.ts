import { UpdateEnrollmentDto } from '../dtos/classroom/update-enrollment.dto';
import { EnrollmentEntity, UserEntity } from '../entities';

export abstract class EnrollmentRepository {
  abstract joinStudent( studentId: string, classroomId: string ): Promise<EnrollmentEntity>
  abstract isStudentInClassroom( studentId: string, classroomId: string ): Promise<boolean>
  abstract updateEnrollment( enrollmentId: string, updateEnrollmentDto: UpdateEnrollmentDto ): Promise<EnrollmentEntity>
  abstract getStudentsOfClassroom( classroomId: string, offset: number, limit: number ): Promise<any[]>
  abstract countStudentsInClassroom( classroomId: string ): Promise<number>
}