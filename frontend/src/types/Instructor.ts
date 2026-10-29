export interface Instructor {
  instructorId: number;
  firstName: string;
  lastName: string;
  userName: string | null;
  email: string;
  /** DateOnly from the API, serialized as YYYY-MM-DD. */
  hireDate: string;
  salary: number;
  managerId: number | null;
  isActive: boolean;
}
export interface CreateInstructor {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userName?: string | null;
  /** DateOnly serialized as YYYY-MM-DD. */
  hireDate: string;
  salary: number;
  managerId: number | null;
  isActive: boolean;
}

export interface UpdateInstructor {
  firstName: string;
  lastName: string;
  email: string;
  userName?: string | null;
  /** DateOnly serialized as YYYY-MM-DD. */
  hireDate: string;
  salary: number;
  managerId: number | null;
  isActive: boolean;
}


export interface ChangeInstructorPassword {
  newPassword: string;
  confirmPassword: string;
}

export interface DeleteInstructorResponse {
  message: string;
}
