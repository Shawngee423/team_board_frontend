import React from 'react';
import { format } from 'date-fns';
import { JobExperience, EducationExperience } from '../../types/user';
import { Briefcase, GraduationCap, Calendar } from 'lucide-react';

interface ExperienceListProps {
  jobExperiences: JobExperience[];
  educationExperiences: EducationExperience[];
}

const ExperienceList: React.FC<ExperienceListProps> = ({ 
  jobExperiences, 
  educationExperiences 
}) => {
  const formatDateRange = (startDate: string, endDate?: string) => {
    const start = format(new Date(startDate), 'MMM yyyy');
    const end = endDate ? format(new Date(endDate), 'MMM yyyy') : 'Present';
    return `${start} - ${end}`;
  };
  
  return (
    <div className="space-y-6">
      {/* Work Experience */}
      <div className="bg-white rounded-lg shadow-card p-6">
        <h3 className="font-semibold text-xl text-gray-800 mb-4 flex items-center gap-2">
          <Briefcase size={20} className="text-primary-500" />
          Work Experience
        </h3>
        
        {jobExperiences.length === 0 ? (
          <p className="text-gray-500 italic">No work experience added yet</p>
        ) : (
          <div className="space-y-6">
            {jobExperiences.map((job, index) => (
              <div 
                key={index} 
                className="relative pl-6 border-l-2 border-primary-200 pb-6 last:pb-0"
              >
                <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-primary-500"></div>
                <h4 className="font-medium text-lg text-gray-800">{job.job_title}</h4>
                <p className="text-gray-600">{job.company}</p>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <Calendar size={14} className="mr-1" />
                  {formatDateRange(job.start_time, job.end_time)}
                </div>
                {job.experience_description && (
                  <p className="mt-2 text-gray-700">{job.experience_description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Education */}
      <div className="bg-white rounded-lg shadow-card p-6">
        <h3 className="font-semibold text-xl text-gray-800 mb-4 flex items-center gap-2">
          <GraduationCap size={20} className="text-primary-500" />
          Education
        </h3>
        
        {educationExperiences.length === 0 ? (
          <p className="text-gray-500 italic">No education added yet</p>
        ) : (
          <div className="space-y-6">
            {educationExperiences.map((edu, index) => (
              <div 
                key={index} 
                className="relative pl-6 border-l-2 border-primary-200 pb-6 last:pb-0"
              >
                <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-primary-500"></div>
                <h4 className="font-medium text-lg text-gray-800">{edu.major}</h4>
                <p className="text-gray-600">{edu.school}</p>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <Calendar size={14} className="mr-1" />
                  {formatDateRange(edu.start_time, edu.end_time)}
                </div>
                {edu.experience_description && (
                  <p className="mt-2 text-gray-700">{edu.experience_description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExperienceList;