import api from "./axios";
import { Person, PersonalInfoFull } from "../types/user";

export const UserService = {
  getAllUsers: async (skip?: number, limit?: number) => {
    const response = await api.get("/persons/", { params: { skip, limit } });
    return response.data;
  },

  getUserById: async (userId: number) => {
    const response = await api.get(`/persons/${userId}`);
    return response.data;
  },

  getUserFullInfo: async (userId: number): Promise<PersonalInfoFull> => {
    const response = await api.get(`/blog/user/${userId}`);
    return response.data;
  },

  createUser: async (user: Partial<Person>) => {
    const response = await api.post("/persons/", user);
    return response.data;
  },

  updateUser: async (userId: number, user: Partial<Person>) => {
    const response = await api.put(`/persons/${userId}`, user);
    return response.data;
  },

  deleteUser: async (userId: number) => {
    const response = await api.delete(`/persons/${userId}`);
    return response.data;
  },

  // Education experiences
  getUserEducation: async (userId: number) => {
    const response = await api.get(`/persons/${userId}/education`);
    return response.data;
  },

  addUserEducation: async (userId: number, educationData: any) => {
    const response = await api.post(
      `/persons/${userId}/education`,
      educationData
    );
    return response.data;
  },

  // Job experiences
  getUserJobs: async (userId: number) => {
    const response = await api.get(`/persons/${userId}/jobs`);
    return response.data;
  },

  addUserJob: async (userId: number, jobData: any) => {
    const response = await api.post(`/persons/${userId}/jobs`, jobData);
    return response.data;
  },

  // User skills
  addSkillToUser: async (userId: number, skillId: number, level: number) => {
    const response = await api.post(
      `/persons/${userId}/skills/${skillId}`,
      null,
      {
        params: { level },
      }
    );
    return response.data;
  },
};
