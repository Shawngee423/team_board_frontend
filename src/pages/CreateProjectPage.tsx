import React from 'react';
import Layout from '../components/layout/Layout';
import ProjectForm from '../components/projects/ProjectForm';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const CreateProjectPage: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  
  // Redirect to login if not authenticated
  if (!loading && !isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Create New Project</h1>
        <ProjectForm />
      </div>
    </Layout>
  );
};

export default CreateProjectPage;