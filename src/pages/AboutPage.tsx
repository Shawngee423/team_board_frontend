import React from 'react';
import Layout from '../components/layout/Layout';
import { Globe, Users, Briefcase, Code } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">About Team Board</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connecting talented individuals with exciting projects and building effective teams for success.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div className="bg-white p-8 rounded-lg shadow-card">
            <h2 className="text-2xl font-bold text-primary-500 mb-4">Our Mission</h2>
            <p className="text-gray-700">
              Team Board was created to solve the problem of finding the right collaborators for projects. 
              We believe that great ideas deserve great teams, and our platform makes it easy to connect 
              based on skills, experience, and shared interests.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-card">
            <h2 className="text-2xl font-bold text-primary-500 mb-4">How It Works</h2>
            <p className="text-gray-700">
              Project creators can post their ideas and specify the skills they need. Team members can browse
              projects and apply based on their expertise. Our matching algorithm helps ensure the right fit
              for successful collaboration.
            </p>
          </div>
        </div>
        
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-card text-center transition-transform duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                <Globe size={24} className="text-primary-500" />
              </div>
              <h3 className="font-semibold mb-2">Global Network</h3>
              <p className="text-gray-600 text-sm">
                Connect with talented individuals from around the world
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-card text-center transition-transform duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                <Users size={24} className="text-primary-500" />
              </div>
              <h3 className="font-semibold mb-2">Team Building</h3>
              <p className="text-gray-600 text-sm">
                Find the perfect mix of skills for your project needs
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-card text-center transition-transform duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                <Briefcase size={24} className="text-primary-500" />
              </div>
              <h3 className="font-semibold mb-2">Project Management</h3>
              <p className="text-gray-600 text-sm">
                Tools to organize and track project progress effectively
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-card text-center transition-transform duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                <Code size={24} className="text-primary-500" />
              </div>
              <h3 className="font-semibold mb-2">Skill Matching</h3>
              <p className="text-gray-600 text-sm">
                Advanced algorithms to connect the right people with projects
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-primary-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Join our growing community of creators and collaborators. Find your next project or build your dream team today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="/login" 
              className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Sign Up Now
            </a>
            <a 
              href="/projects" 
              className="px-6 py-3 bg-white border border-primary-500 text-primary-500 rounded-lg hover:bg-primary-50 transition-colors"
            >
              Browse Projects
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;