import type { StudentProfile } from './StudentsProfiles'; // استدعاء نوع الملف الشخصي

export interface StudentWithProfile extends Student {
    profile?: StudentProfile | null;
}
export interface CreateStudent {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string | null;
    dateOfBirth?: string | Date | null;
    password: string;
}

export interface UpdateStudent {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string | null;
    dateOfBirth?: string | Date | null;
    status: string;
}

export interface ChangePassword {
    newPassword: string;
}

export interface Student{
    studentId: number;
      firstName: string;
    lastName: string;
    email: string;
    dateOfBirth?: string | Date | null;
    status: string;
}