import api from './AxiosClient';
import type { Enrollment, CreateEnrollment, UpdateEnrollment } from '../types/Enrollments';

const endpoint = '/Enrollments';

export const EnrollmentsService = {
  getAll: async (): Promise<Enrollment[]> => {
    const response = await api.get<Enrollment[]>(endpoint);
    return response.data;
  },

  getById: async (id: number): Promise<Enrollment> => {
    const response = await api.get<Enrollment>(`${endpoint}/${id}`);
    return response.data;
  },

  getByStudentId: async (studentId: number): Promise<Enrollment[]> => {
    const response = await api.get<Enrollment[]>(`${endpoint}/student/${studentId}`);
    return response.data;
  },

  getByCourseId: async (courseId: number): Promise<Enrollment[]> => {
    const response = await api.get<Enrollment[]>(`${endpoint}/course/${courseId}`);
    return response.data;
  },

  create: async (data: CreateEnrollment): Promise<Enrollment> => {
    const response = await api.post<Enrollment>(endpoint, data);
    return response.data;
  },

  update: async (id: number, data: UpdateEnrollment): Promise<number> => {
    const response = await api.put(`${endpoint}/${id}`, data);
    return response.status;
  },

  remove: async (id: number): Promise<number> => {
    const response = await api.delete(`${endpoint}/${id}`);
    return response.status;
  },
};

