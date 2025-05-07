import React from 'react';
import { SkillInfoResponse } from '../../types/skill';

interface SkillsListProps {
  skills: SkillInfoResponse[];
}

const SkillsList: React.FC<SkillsListProps> = ({ skills }) => {
  const getSkillColor = (level: number) => {
    if (level >= 80) return 'bg-green-100 border-green-500 text-green-700';
    if (level >= 50) return 'bg-blue-100 border-blue-500 text-blue-700';
    return 'bg-orange-100 border-orange-500 text-orange-700';
  };

  return (
    <div className="bg-white rounded-lg shadow-card p-6">
      <h3 className="font-semibold text-xl text-gray-800 mb-4 relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-4/5 before:w-1 before:bg-primary-500 before:rounded">
        Skills
      </h3>
      
      {skills.length === 0 ? (
        <p className="text-gray-500 italic">No skills added yet</p>
      ) : (
        <div className="space-y-4">
          {skills.map(skill => (
            <div key={skill.skill_id} className="skill-item">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <span className="font-medium text-gray-700">{skill.skill_name}</span>
                  <span className={`ml-2 text-xs px-2 py-0.5 rounded-full border ${getSkillColor(skill.level)}`}>
                    {skill.level >= 80 ? 'Expert' : skill.level >= 50 ? 'Intermediate' : 'Beginner'}
                  </span>
                </div>
                <span className="text-sm text-gray-500">{skill.level}%</span>
              </div>
              
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary-500 rounded-full transition-all duration-500"
                  style={{ width: `${skill.level}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SkillsList;