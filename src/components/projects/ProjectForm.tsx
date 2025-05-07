import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus } from 'lucide-react';
import { ProjectCreateRequest, ProjectCollaboration } from '../../types/project';
import { ProjectService } from '../../api/projectService';
import { SkillService } from '../../api/skillService';
import { SkillInfo } from '../../types/skill';
import { useAuth } from '../../context/AuthContext';

const ProjectForm: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState<SkillInfo[]>([]);
  const [project, setProject] = useState<ProjectCreateRequest>({
    project_title: '',
    project_creator_id: user?.id || 1,
    project_description: '',
    project_background_img_url: '',
    is_draft: 0,
    collaboration_list: []
  });
  
  // Fetch skills on component mount
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await SkillService.getAllSkills();
        setSkills(data);
      } catch (err) {
        console.error('Failed to fetch skills:', err);
      }
    };
    
    fetchSkills();
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProject(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setProject(prev => ({ ...prev, is_draft: checked ? 1 : 0 }));
  };
  
  const addCollaboration = () => {
    setProject(prev => ({
      ...prev,
      collaboration_list: [
        ...(prev.collaboration_list || []),
        { skill_id: 0, headcount: 1 }
      ]
    }));
  };
  
  const removeCollaboration = (index: number) => {
    setProject(prev => ({
      ...prev,
      collaboration_list: prev.collaboration_list?.filter((_, i) => i !== index) || []
    }));
  };
  
  const handleCollaborationChange = (index: number, field: keyof ProjectCollaboration, value: any) => {
    setProject(prev => {
      const updatedList = [...(prev.collaboration_list || [])];
      updatedList[index] = {
        ...updatedList[index],
        [field]: value
      };
      return { ...prev, collaboration_list: updatedList };
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Validate skill selections
      const invalidCollaboration = project.collaboration_list?.some(
        collab => collab.skill_id === 0 || collab.headcount < 1
      );
      
      if (invalidCollaboration) {
        alert('Please select valid skills and headcount for all collaboration requirements');
        setLoading(false);
        return;
      }
      
      // Filter out any potential empty strings
      const cleanedProject: ProjectCreateRequest = {
        ...project,
        project_title: project.project_title.trim(),
        project_creator_id: user?.id || 1,
        project_description: project.project_description?.trim() || undefined,
        project_background_img_url: project.project_background_img_url?.trim() || undefined
      };
      
      await ProjectService.createProject(cleanedProject);
      navigate('/');
    } catch (err) {
      console.error('Failed to create project:', err);
      alert('Failed to create project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-card p-6 max-w-3xl mx-auto">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <input
          type="text"
          name="project_title"
          value={project.project_title}
          onChange={handleChange}
          placeholder="Project Title"
          className="w-full text-2xl font-semibold text-primary-500 border-0 focus:ring-0 focus:outline-none p-0"
          required
        />
      </div>
      
      {/* Collaboration Requirements Section */}
      <div className="bg-primary-50 rounded-lg p-5 mb-6">
        <h3 className="font-medium mb-4">Collaboration Requirements</h3>
        
        <div className="space-y-4">
          {project.collaboration_list?.map((collab, index) => (
            <div key={index} className="flex items-center gap-3 bg-white p-3 rounded-lg">
              <select
                value={collab.skill_id}
                onChange={(e) => handleCollaborationChange(index, 'skill_id', Number(e.target.value))}
                className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                required
              >
                <option value={0}>Select Skill</option>
                {skills.map(skill => (
                  <option key={skill.skill_id} value={skill.skill_id}>
                    {skill.skill_name}
                  </option>
                ))}
              </select>
              
              <input
                type="number"
                min="1"
                max="100"
                value={collab.headcount}
                onChange={(e) => handleCollaborationChange(index, 'headcount', Number(e.target.value))}
                className="w-24 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                required
              />
              
              <button
                type="button"
                onClick={() => removeCollaboration(index)}
                className="p-2 text-red-500 hover:text-red-700"
              >
                <X size={18} />
              </button>
            </div>
          ))}
        </div>
        
        <button
          type="button"
          onClick={addCollaboration}
          className="mt-4 flex items-center gap-1 text-primary-500 hover:text-primary-600 font-medium transition-colors"
        >
          <Plus size={16} /> Add Requirement
        </button>
      </div>
      
      {/* Project Description */}
      <div className="mb-6">
        <label className="block mb-2 font-medium text-gray-700">
          Project Description
        </label>
        <textarea
          name="project_description"
          value={project.project_description || ''}
          onChange={handleChange}
          placeholder="Describe your project..."
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 min-h-[200px] resize-y"
        />
      </div>
      
      {/* Background Image URL */}
      <div className="mb-6">
        <label className="block mb-2 font-medium text-gray-700">
          Background Image URL
        </label>
        <input
          type="url"
          name="project_background_img_url"
          value={project.project_background_img_url || ''}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      </div>
      
      {/* Publishing Options */}
      <div className="flex justify-between items-center mt-8">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={project.is_draft === 1}
            onChange={handleCheckboxChange}
            className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
          />
          <span>Save as Draft</span>
        </label>
        
        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors ${
            loading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Creating...' : 'Publish Project'}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;