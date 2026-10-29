import api from './AxiosClient';
import type { 
    StudentProfile, 
    CreateStudentProfile, 
    UpdateStudentProfile 
} from '../types/StudentsProfiles';

export const StudentsProfileService = {
  getAll: async (): Promise<StudentProfile[]> => {
    const response = await api.get<StudentProfile[]>('/StudentsProfileController/GetAllProfiles');
    return response.data;
  },

  getById: async (studentId: number): Promise<StudentProfile> => {
    const response = await api.get<StudentProfile>(`/StudentsProfileController/${studentId}`);
    return response.data;
  },

  getByCity: async (city: string): Promise<StudentProfile[]> => {
    const response = await api.get<StudentProfile[]>(`/StudentsProfileController/city/${city}`);
    return response.data;
  },

  getByCountry: async (country: string): Promise<StudentProfile[]> => {
    const response = await api.get<StudentProfile[]>(`/StudentsProfileController/country/${country}`);
    return response.data;
  },

  create: async (data: CreateStudentProfile): Promise<CreateStudentProfile> => {
    const response = await api.post<CreateStudentProfile>('/StudentsProfileController/AddNewStudentProfile', data);
    return response.data; 
  },

  update: async (studentId: number, data: UpdateStudentProfile): Promise<UpdateStudentProfile> => {
    const response = await api.put<UpdateStudentProfile>(`/StudentsProfileController/${studentId}`, data);
    return response.data; 
  },

  remove: async (studentId: number): Promise<number> => {
    const response = await api.delete(`/StudentsProfileController/${studentId}`);
    return response.status;
  },

  checkIfExists: async (studentId: number): Promise<UpdateStudentProfile> => {
    const response = await api.get<UpdateStudentProfile>(`/StudentsProfileController/${studentId}/IsExists`);
    return response.data;
  }
};