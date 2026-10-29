export interface StudentProfile {
    studentId: number;
    address?: string | null;
    city?: string | null;
    country?: string | null;
    bio?: string | null;
    linkedInUrl?: string | null;
}

export interface CreateStudentProfile {
    address?: string | null;
    city?: string | null;
    country?: string | null;
    bio?: string | null;
    linkedInUrl?: string | null;
}

export interface UpdateStudentProfile {
    address?: string | null;
    city?: string | null;
    country?: string | null;
    bio?: string | null;
    linkedInUrl?: string | null;
}