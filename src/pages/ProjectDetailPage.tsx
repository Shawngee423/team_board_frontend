import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import CollaborationRequirement from '../components/projects/CollaborationRequirement';
import CommentSection from '../components/projects/CommentSection';
import { ProjectService } from '../api/projectService';
import { ProjectInfoResponse, ProjectComment } from '../types/project';
import { useAuth } from '../context/AuthContext';
import { Calendar, User } from 'lucide-react';
import { format } from 'date-fns';

const ProjectDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { user, isAuthenticated } = useAuth();
  const [project, setProject] = useState<ProjectInfoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;
      
      try {
        setLoading(true);
        const data = await ProjectService.getProjectById(parseInt(projectId));
        setProject(data);
      } catch (err) {
        console.error('Failed to fetch project:', err);
        setError('Failed to load project details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  const handleApplyForSkill = async (skillId: number) => {
    if (!isAuthenticated || !user) {
      alert('Please sign in to apply for this position');
      return;
    }
    
    if (!projectId) return;
    
    try {
      // This would be the logic to apply for a skill
      // In a real app, you'd call your API to save the application
      alert(`Application submitted for skill ID: ${skillId}`);
      
      // Refresh the project data to show updated counts
      const updatedProject = await ProjectService.getProjectById(parseInt(projectId));
      setProject(updatedProject);
    } catch (err) {
      console.error('Failed to apply for skill:', err);
      alert('Failed to submit application. Please try again.');
    }
  };

  const handleAddComment = async (message: string, replyToId?: number) => {
    if (!isAuthenticated || !user || !projectId) return;
    
    try {
      await ProjectService.addComment(
        parseInt(projectId),
        user.id,
        {
          comment_message: message,
          re_comment_id: replyToId
        }
      );
      
      // Refresh the project data to show the new comment
      const updatedProject = await ProjectService.getProjectById(parseInt(projectId));
      setProject(updatedProject);
    } catch (err) {
      console.error('Failed to add comment:', err);
      throw err;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-12"></div>
            <div className="h-56 bg-gray-200 rounded mb-8"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !project) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p className="mb-8">{error || 'Failed to load project details'}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <article className="max-w-4xl mx-auto px-4 py-10">
        {/* Project Header */}
        <header className="mb-8 border-b border-gray-200 pb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-500 mb-4">
            {project.project_title}
          </h1>
          
          <div className="flex flex-wrap items-center text-sm text-gray-600 gap-y-2">
            <div className="flex items-center mr-6">
              <User size={16} className="mr-1 text-gray-500" />
              <span>{project.project_creator_name}</span>
            </div>
            <div className="flex items-center">
              <Calendar size={16} className="mr-1 text-gray-500" />
              <span>{format(new Date(project.project_create_time), 'MMMM d, yyyy')}</span>
            </div>
          </div>
        </header>
        
        {/* Project Image */}
        {project.project_background_img_url && (
          <div className="mb-8">
            <img 
              src={project.project_background_img_url} 
              alt={project.project_title} 
              className="w-full h-auto max-h-[400px] object-cover rounded-lg"
            />
          </div>
        )}
        
        {/* Project Description */}
        <div className="prose max-w-none mb-10">
          <p className="text-gray-700 whitespace-pre-line">
            {project.project_description || 'No description provided for this project.'}
          </p>
        </div>
        
        {/* Collaboration Requirements */}
        {project.collaboration_list.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">Collaboration Needs</h2>
            <div className="space-y-3">
              {project.collaboration_list.map(collab => (
                <CollaborationRequirement 
                  key={collab.skill_id}
                  collaboration={collab}
                  onApply={handleApplyForSkill}
                />
              ))}
            </div>
          </section>
        )}
        
        {/* Comments Section */}
        <CommentSection 
          comments={project.comment_list} 
          projectId={project.project_id}
          onAddComment={handleAddComment}
        />
      </article>
    </Layout>
  );
};

export default ProjectDetailPage;