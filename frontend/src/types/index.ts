/**
 * Academic & Training Center Data Transfer Objects (DTOs)
 * Strictly derived from the ASP.NET Core Web API Controllers:
 * - CoursesController.cs
 * - InstructorsController.cs
 * - StudentsController.cs
 * - StudentsProfileController.cs
 * - EnrollmentsController.cs
 */

export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type CourseStatus = 'Draft' | 'Published' | 'Active' | 'Archived';

export interface Course {
  courseId: number;
  title: string;
  code: string;
  description: string;
  price: number;
  level: CourseLevel | string;
  durationHours: number;
  status: CourseStatus | string;
  instructorId: number;
  publishedAt?: string | null;
  // Presentation augmentations
  instructorName?: string;
  enrolledStudentsCount?: number;
}

export interface CreateCourseDTO {
  title: string;
  code: string;
  description: string;
  price: number;
  level: string;
  durationHours: number;
  status: string;
  instructorId: number;
}

export interface UpdateCourseDTO extends CreateCourseDTO {
  publishedAt?: string | null;
}

export interface Instructor {
  instructorId: number;
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  hireDate: string;
  salary: number;
  managerId?: number | null;
  isActive: boolean;
  // Presentation augmentations
  managerName?: string;
  activeCoursesCount?: number;
}

export interface CreateInstructorDTO {
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  hireDate: string;
  salary: number;
  managerId?: number | null;
  isActive: boolean;
  password?: string;
}

export type StudentStatus = 'Active' | 'Suspended' | 'Graduated' | 'Pending';

export interface Student {
  studentId: number;
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  status: StudentStatus | string;
  // Merged profile for unified presentation
  profile?: StudentProfile;
  enrolledCoursesCount?: number;
}

export interface StudentProfile {
  studentId: number;
  address: string;
  city: string;
  country: string;
  bio: string;
  linkedInUrl: string;
}

export type EnrollmentStatus = 'Enrolled' | 'In Progress' | 'Completed' | 'Dropped';

export interface Enrollment {
  enrollmentId: number;
  studentId: number;
  courseId: number;
  enrollmentDate: string;
  progressPercent: number;
  finalGrade?: number | null;
  completionDate?: string | null;
  status: EnrollmentStatus | string;
  // Presentation context
  studentName?: string;
  studentEmail?: string;
  courseTitle?: string;
  courseCode?: string;
  coursePrice?: number;
}

export interface CreateEnrollmentDTO {
  studentId: number;
  courseId: number;
}

export interface UpdateEnrollmentDTO {
  progressPercent: number;
  finalGrade?: number | null;
  completionDate?: string | null;
  status: string;
}

