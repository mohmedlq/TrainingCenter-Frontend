import api from './AxiosClient';
import type {
  ChangeInstructorPassword,
  CreateInstructor,
  DeleteInstructorResponse,
  Instructor,
  UpdateInstructor,
} from '../types/Instructor';
const endpoint = '/InstructorsController';

export const InstructorsService = {
  async getAll(): Promise<Instructor[]> {
    const response = await api.get<Instructor[]>(`${endpoint}/GetAll`);
    return response.data;
  },

  async getById(id: number): Promise<Instructor> {
    const response = await api.get<Instructor>(`${endpoint}/${id}`);
    return response.data;
  },

  async getByEmail(email: string): Promise<Instructor> {
    const response = await api.get<Instructor>(
      `${endpoint}/email/${encodeURIComponent(email)}`,
    );
    return response.data;
  },

  async getByManager(managerId: number): Promise<Instructor[]> {
    const response = await api.get<Instructor[]>(`${endpoint}/manager/${managerId}`);
    return response.data;
  },

  async getActive(): Promise<Instructor[]> {
    const response = await api.get<Instructor[]>(`${endpoint}/active`);
    return response.data;
  },

  async create(data: CreateInstructor): Promise<CreateInstructor> {
    const response = await api.post<CreateInstructor>(`${endpoint}/AddNew`, data);
    return response.data;
  },

  async update(id: number, data: UpdateInstructor): Promise<UpdateInstructor> {
    const response = await api.put<Instructor>(`${endpoint}/${id}`, data);
    return response.data;
  },
  async IsExist(id:number):Promise<boolean>{
    const response = await api.get(`${endpoint}/IsExist/${id}`);
    return response.data;
  },
  async changePassword(
    id: number,
    data: ChangeInstructorPassword,
  ): Promise<void> {
    (await api.put<void>(`${endpoint}/${id}/Password`, data)).statusText;
  },

  async delete(id: number): Promise<DeleteInstructorResponse> {
    const response = await api.delete<DeleteInstructorResponse>(`${endpoint}/${id}`);
    return response.data;
  },
};
