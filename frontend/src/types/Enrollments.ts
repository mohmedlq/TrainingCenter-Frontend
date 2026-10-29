export interface Enrollment {
  enrollmentId: number;
  studentId: number;
  courseId: number;
  enrollmentDate: string;
  progressPercent: number;
  finalGrade?: number | null;
  completionDate?: string | null;
  status: string;
}

export interface EnrollmentWithDetails extends Enrollment {
  studentName?: string;
  studentEmail?: string;
  courseTitle?: string;
  courseCode?: string;
  coursePrice?: number;
}

export interface CreateEnrollment {
  studentId: number;
  courseId: number;
}

export interface UpdateEnrollment {
  progressPercent: number;
  finalGrade?: number | null;
  completionDate?: string | null;
  status?: string;
}

