import api from './AxiosClient';
import type { Course, CreateCourse, UpdateCourse } from '../types/Courses';

export const CoursesService = {
  getAll: async (): Promise<Course[]> => {
    const response = await api.get<Course[]>('/courses');
    return response.data;
  },

  getById: async (id: number): Promise<Course> => {
    const response = await api.get<Course>(`/courses/${id}`);
    return response.data;
  },

  getByCode: async (code: string): Promise<Course> => {
    const response = await api.get<Course>(`/courses/code/${code}`);
    return response.data;
  },
  getTotalEnrolled:async (id:number|undefined):Promise<number>=>{
    const response =await api.get(`/courses/total-enrolled/${id}`);
    return response.data;
  },

  getByStudentId: async (id: number): Promise<Course[]> => {
    const response = await api.get<Course[]>(`/courses/student/${id}`);
    return response.data;
  },

  getByInstructorId: async (id: number): Promise<Course[]> => {
    const response = await api.get<Course[]>(`/courses/instructor/${id}`);
    return response.data;
  },

  create: async (data: CreateCourse): Promise<number> => {
    const response = await api.post<Course>('/courses', data);
    return response.status;
  },

  update: async (id: number, data: UpdateCourse): Promise<number> => {
    const response = await api.put(`/courses/${id}`, data);
    return response.status;
  },

  remove: async (id: number): Promise<number> => {
    const response = await api.delete(`/courses/${id}`);
    return response.status;
  },
};