import api from './AxiosClient';
import type { 
  Student, 
  UpdateStudent,
  CreateStudent, 
  ChangePassword 
} from '../types/Students'; 

export const StudentsService = {
  getAll: async (): Promise<Student[]> => {
    const response = await api.get<Student[]>('/StudentsController/GetAllStudents');
    return response.data;
  },

  getById: async (id: number): Promise<Student> => {
    const response = await api.get<Student>(`/StudentsController/GetStudentById/${id}`);
    return response.data;
  },

  getByEmail: async (email: string): Promise<Student> => {
    const response = await api.get<Student>(`/StudentsController/GetStudentByEmail/${email}`);
    return response.data;
  },

  getByStatus: async (status: string): Promise<Student[]> => {
    const response = await api.get<Student[]>(`/StudentsController/GetStudentsByStatus/${status}`);
    return response.data;
  },

  create: async (data: CreateStudent): Promise<number> => {
    const response = await api.post('/StudentsController/AddNewStudent', data);
    return response.status;
  },

  update: async (id: number, data: UpdateStudent): Promise<number> => {
    const response = await api.put(`/StudentsController/UpdateStudent/${id}`, data);
    return response.status;
  },

  changePassword: async (id: number, data: ChangePassword): Promise<number> => {
    const response = await api.put(`/StudentsController/ChangePassword/${id}`, data);
    return response.status;
  },

  remove: async (id: number): Promise<number> => {
    const response = await api.delete(`/StudentsController/DeleteStudent/${id}`);
    return response.status;
  },
};