import { SkillInfoResponse } from "./skill";

export interface Person {
  user_id: number;
  user_name?: string;
  job_title?: string;
  city?: string;
  country?: string;
  phone_number?: string;
  website?: string;
  profile_url?: string;
}

export interface EducationExperience {
  major: string;
  school: string;
  start_time: string;
  end_time?: string;
  experience_description?: string;
}

export interface JobExperience {
  job_title: string;
  company: string;
  start_time: string;
  end_time?: string;
  experience_description?: string;
}

export interface PersonalInfoFull {
  user_id: number;
  user_name?: string;
  job_title?: string;
  city?: string;
  country?: string;
  phone_number?: string;
  website?: string;
  profile_url?: string;
  skills: SkillInfoResponse[];
  job_experiences: JobExperience[];
  education_experiences: EducationExperience[];
}