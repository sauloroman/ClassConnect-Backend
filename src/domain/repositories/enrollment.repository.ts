import { UpdateEnrollmentDto } from '../dtos/classroom/update-enrollment.dto';
import { EnrollmentEntity } from '../entities';

export abstract class EnrollmentRepository {
  abstract joinStudent( studentId: string, classroomId: string ): Promise<EnrollmentEntity>
  abstract isStudentInClassroom( studentId: string, classroomId: string ): Promise<boolean>
  abstract updateEnrollment( enrollmentId: string, updateEnrollmentDto: UpdateEnrollmentDto ): Promise<EnrollmentEntity>
}