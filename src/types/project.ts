import { SkillInfo } from "./skill";

export interface Project {
  project_id: number;
  project_title: string;
  project_description?: string;
  project_background_img_url?: string;
  is_draft: number;
  project_creator_id?: number;
  project_create_time?: string;
}

export interface ProjectWithSkills extends Project {
  required_skills: SkillInfo[];
}

export interface ProjectCollaboration {
  skill_id: number;
  headcount: number;
}

export interface ProjectCollaborationResponse {
  skill_id: number;
  skill_name: string;
  headcount: number;
  applied_number: number;
}

export interface ProjectComment {
  comment_id: number;
  user_id: number;
  user_name: string;
  comment_time: string;
  comment_message: string;
  re_list: ProjectComment[];
}

export interface ProjectInfoResponse {
  project_id: number;
  project_title: string;
  project_creator_name: string;
  project_create_time: string;
  project_description?: string;
  project_background_img_url?: string;
  collaboration_list: ProjectCollaborationResponse[];
  comment_list: ProjectComment[];
}

export interface ProjectCreateRequest {
  project_title: string;
  project_creator_id: number;
  project_description?: string;
  project_background_img_url?: string;
  is_draft?: number;
  collaboration_list?: ProjectCollaboration[];
}

export interface ProjectInfo {
  project_id?: number;
  project_title?: string;
  project_creator_id?: number;
  project_create_time?: string;
  project_description?: string;
  project_background_img_url?: string;
  is_draft?: number;
}