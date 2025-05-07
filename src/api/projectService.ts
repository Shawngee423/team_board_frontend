import api from './axios';
import { Project, ProjectCreateRequest, ProjectInfoResponse } from '../types/project';

export const ProjectService = {
  getAllProjects: async (skip?: number, limit?: number) => {
    const response = await api.get('/projects/', { params: { skip, limit } });
    return response.data;
  },

  searchProjects: async (params: {
    keyword?: string;
    creator_id?: number;
    is_draft?: number;
    skip?: number;
    limit?: number;
  }) => {
    const response = await api.get('/blog/projects/search', { params });
    return response.data;
  },

  getProjectById: async (projectId: number): Promise<ProjectInfoResponse> => {
    const response = await api.get(`/blog/projects/${projectId}`);
    return response.data;
  },

  createProject: async (project: ProjectCreateRequest) => {
    const response = await api.post('/blog/projects/create', project);
    return response.data;
  },

  updateProject: async (projectId: number, project: Partial<Project>) => {
    const response = await api.put(`/projects/${projectId}`, project);
    return response.data;
  },

  deleteProject: async (projectId: number) => {
    const response = await api.delete(`/projects/${projectId}`);
    return response.data;
  },

  addComment: async (projectId: number, userId: number, commentData: { comment_message: string; re_comment_id?: number }) => {
    const response = await api.post(`/projects/${projectId}/comments`, commentData, {
      params: { user_id: userId }
    });
    return response.data;
  },

  getComments: async (projectId: number, skip?: number, limit?: number) => {
    const response = await api.get(`/projects/${projectId}/comments`, {
      params: { skip, limit }
    });
    return response.data;
  },

  addSkillToProject: async (projectId: number, skillId: number, headcount: number) => {
    const response = await api.post(`/projects/${projectId}/skills/${skillId}`, null, {
      params: { headcount }
    });
    return response.data;
  }
};