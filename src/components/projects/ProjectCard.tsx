import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User } from 'lucide-react';
import { ProjectInfo } from '../../types/project';

interface ProjectCardProps {
  project: ProjectInfo;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  // Format date to a more readable format
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <article className="bg-white rounded-lg overflow-hidden shadow-card transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div 
        className="h-48 bg-gray-200 bg-center bg-cover"
        style={{
          backgroundImage: project.project_background_img_url 
            ? `url(${project.project_background_img_url})` 
            : `url('https://images.pexels.com/photos/7102/notes-macbook-study-conference.jpg?auto=compress&cs=tinysrgb&w=800')`
        }}
      ></div>
      
      <div className="p-6">
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <span className="flex items-center">
            <User size={14} className="mr-1" /> 
            Creator: {project.project_creator_id || 'Unknown'}
          </span>
          <span className="mx-2">•</span>
          <span className="flex items-center">
            <Calendar size={14} className="mr-1" /> 
            {formatDate(project.project_create_time)}
          </span>
        </div>
        
        <h3 className="font-semibold text-xl text-primary-500 mb-2">
          {project.project_title || 'Untitled Project'}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {project.project_description || 'No description provided for this project.'}
        </p>
        
        <Link 
          to={`/projects/${project.project_id}`} 
          className="inline-block text-primary-500 font-semibold hover:text-primary-600 transition-colors"
        >
          Read More
        </Link>
      </div>
    </article>
  );
};

export default ProjectCard;