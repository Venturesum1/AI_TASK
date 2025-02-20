import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

export interface LoginInput {
  email: string;
  password: string;
}


export interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  dueDate: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export const auth = {
  login: (data: LoginInput) => api.post('/auth/login', data),
  register: async (credentials: { email: string, password: string }) => {
    return axios.post("/api/register", credentials)
  }
};

export const tasks = {
  getAll: async () => {
    return axios.get("/api/tasks")
  },
  create: async (taskData: { title: string, description: string, dueDate: string, status: string }) => {
    return axios.post("/api/tasks", taskData)
  },
  update: async (taskId: number, updateData: { status: string }) => {
    return axios.put(`/api/tasks/${taskId}`, updateData)
  },
  delete: (id: number) => api.delete(`/tasks/${id}`),
};

export default api;