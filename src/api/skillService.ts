import api from './axios';
import { Skill, SkillCreate } from '../types/skill';

export const SkillService = {
  getAllSkills: async (skip?: number, limit?: number) => {
    const response = await api.get('/skills/', { params: { skip, limit } });
    return response.data;
  },

  getSkillById: async (skillId: number) => {
    const response = await api.get(`/skills/${skillId}`);
    return response.data;
  },

  createSkill: async (skill: SkillCreate) => {
    const response = await api.post('/skills/', skill);
    return response.data;
  },

  updateSkill: async (skillId: number, skill: Partial<Skill>) => {
    const response = await api.put(`/skills/${skillId}`, skill);
    return response.data;
  },

  deleteSkill: async (skillId: number) => {
    const response = await api.delete(`/skills/${skillId}`);
    return response.data;
  }
};