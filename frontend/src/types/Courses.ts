export interface Course {
  courseId: number;
  title: string;
  code: string;
  description?: string;
  price: number;
  level: string;
  durationHours: number;
  status: string;
  instructorId: number;
  publishedAt?: string | null;
  instructorName:string|null;
  totalEnrolled:number;
}

export interface CreateCourse {
  title: string;
  code: string;
  description?: string|null;
  price: number;
  publishedAt?:string|null;
  level: string;
  status: string;
  durationHours: number;
  instructorId: number;
}

export interface UpdateCourse {
  title: string;
  code: string;
  description?: string|null;
  price: number;
  level: string;
  durationHours: number;
  status: string;
  publishedAt?: string | null;
}