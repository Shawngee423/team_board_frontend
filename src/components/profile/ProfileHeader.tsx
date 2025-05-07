import React from 'react';
import { PersonalInfoFull } from '../../types/user';
import { Github, Twitter, Link as LinkIcon, MapPin, Phone, Mail } from 'lucide-react';

interface ProfileHeaderProps {
  profile: PersonalInfoFull;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile }) => {
  return (
    <div className="bg-white rounded-lg shadow-card overflow-hidden">
      {/* Cover image - placeholder or custom */}
      <div className="h-32 sm:h-48 bg-gradient-to-r from-primary-400 to-primary-500"></div>
      
      <div className="p-6 sm:p-8 relative">
        {/* Profile image */}
        <div className="absolute -top-16 left-6 sm:left-8">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white p-1 shadow-lg">
            <div 
              className="w-full h-full rounded-full bg-primary-100 flex items-center justify-center text-primary-500 text-4xl font-bold"
            >
              {profile.user_name ? profile.user_name.charAt(0).toUpperCase() : 'U'}
            </div>
          </div>
        </div>
        
        {/* Profile info */}
        <div className="mt-12 sm:mt-16">
          <h1 className="text-2xl font-bold text-gray-800">{profile.user_name || 'Anonymous User'}</h1>
          {profile.job_title && (
            <p className="text-lg text-gray-600 mt-1">{profile.job_title}</p>
          )}
          
          {/* Location and contact info */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            {(profile.city || profile.country) && (
              <div className="flex items-center text-gray-600">
                <MapPin size={16} className="mr-2" />
                <span>{[profile.city, profile.country].filter(Boolean).join(', ')}</span>
              </div>
            )}
            
            {profile.phone_number && (
              <div className="flex items-center text-gray-600">
                <Phone size={16} className="mr-2" />
                <span>{profile.phone_number}</span>
              </div>
            )}
          </div>
          
          {/* Social links */}
          {profile.website && (
            <div className="mt-4 flex gap-2">
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary-500 transition-colors"
                aria-label="Website"
              >
                <LinkIcon size={18} />
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-primary-500 transition-colors"
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-primary-500 transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;