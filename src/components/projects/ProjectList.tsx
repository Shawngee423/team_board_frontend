import React, { useEffect, useState } from "react";
import { ProjectService } from "../../api/projectService";
import { ProjectInfo } from "../../types/project";
import ProjectCard from "./ProjectCard";
import { Loader } from "lucide-react";

interface ProjectListProps {
  keyword?: string;
}

const ProjectList: React.FC<ProjectListProps> = ({ keyword }) => {
  const [projects, setProjects] = useState<ProjectInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);

        let data;

        if (keyword) {
          // Search projects with keyword
          data = await ProjectService.searchProjects({
            keyword,
            is_draft: 0, // Only show published projects
            skip: 0,
            limit: 20,
          });
        } else {
          // Get all projects
          data = await ProjectService.searchProjects({
            is_draft: 0,
            skip: 0,
            limit: 20,
          });
        }

        setProjects(data);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
        setError("Failed to load projects. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [keyword]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader size={36} className="animate-spin text-primary-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">No projects found</h3>
        <p className="text-gray-600">
          Try different search terms or check back later for new projects!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard key={project.project_id} project={project} />
      ))}
    </div>
  );
};

export default ProjectList;
