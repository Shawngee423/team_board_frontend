export interface Skill {
  skill_id: number;
  skill_name?: string;
}

export interface SkillCreate {
  skill_name?: string;
}

export interface SkillInfo {
  skill_id: number;
  skill_name: string;
}

export interface SkillInfoResponse {
  skill_id: number;
  skill_name: string;
  level: number;
}