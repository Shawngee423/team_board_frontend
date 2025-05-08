import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white py-8 mt-12 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <Link to="/" className="text-xl font-semibold text-primary-500">
              Team Board
            </Link>
            <p className="mt-2 text-sm text-gray-500">
              Find the perfect team for your next project
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 md:gap-12">
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Navigation</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-500 hover:text-primary-500 transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-500 hover:text-primary-500 transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/create-project" className="text-gray-500 hover:text-primary-500 transition-colors">
                    Create Projects
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Connect</h3>
              <div className="flex space-x-4 mt-2">
                <a 
                  href="#" 
                  className="text-gray-500 hover:text-primary-500 transition-colors"
                  aria-label="GitHub"
                >
                  <Github size={20} />
                </a>
                <a 
                  href="#" 
                  className="text-gray-500 hover:text-primary-500 transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter size={20} />
                </a>
                <a 
                  href="#" 
                  className="text-gray-500 hover:text-primary-500 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-200 pt-6 text-center text-sm text-gray-500">
          <p className="flex items-center justify-center">
            Made with <Heart size={16} className="mx-1 text-red-500" /> in 2025
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;