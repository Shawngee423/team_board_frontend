import React from 'react';
import { ProjectCollaborationResponse } from '../../types/project';
import { useAuth } from '../../context/AuthContext';

interface CollaborationRequirementProps {
  collaboration: ProjectCollaborationResponse;
  onApply: (skillId: number) => void;
}

const CollaborationRequirement: React.FC<CollaborationRequirementProps> = ({ 
  collaboration, 
  onApply 
}) => {
  const { isAuthenticated } = useAuth();
  const isFilled = collaboration.applied_number >= collaboration.headcount;
  const progress = (collaboration.applied_number / collaboration.headcount) * 100;

  // Get color based on skill
  const getSkillColor = (skillName: string) => {
    const firstChar = skillName.trim().charAt(0).toLowerCase();
    
    if (firstChar >= 'a' && firstChar <= 'i') return 'bg-orange-100 text-orange-700';
    if (firstChar >= 'j' && firstChar <= 'q') return 'bg-blue-100 text-blue-700';
    return 'bg-green-100 text-green-700';
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSkillColor(collaboration.skill_name)}`}>
          {collaboration.skill_name}
        </span>
        
        <div>
          <div className="flex items-center gap-2">
            <div className="w-32 bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-primary-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="text-sm text-gray-600">
              {collaboration.applied_number}/{collaboration.headcount} Filled
            </span>
          </div>
        </div>
      </div>
      
      <button
        onClick={() => onApply(collaboration.skill_id)}
        disabled={isFilled || !isAuthenticated}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
          isFilled 
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
            : !isAuthenticated 
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-primary-500 text-white hover:bg-primary-600'
        }`}
      >
        {isFilled ? 'Group Full' : `Join as ${collaboration.skill_name}`}
      </button>
    </div>
  );
};

export default CollaborationRequirement;