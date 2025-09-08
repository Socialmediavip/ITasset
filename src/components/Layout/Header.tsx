import React, { useState } from 'react';
import { Search, Bell, ChevronDown, User, Settings, LogOut, Menu } from 'lucide-react';
import { UserProfile } from '../../types';
import ProfileModal from '../Profile/ProfileModal';
import apiService from '../../services/api';

interface HeaderProps {
  onMenuToggle: () => void;
  sidebarOpen: boolean;
  userProfile: UserProfile;
  onProfileUpdate: (profile: UserProfile) => void;
}

export default function Header({ onMenuToggle, sidebarOpen, userProfile, onProfileUpdate }: HeaderProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      apiService.logout();
    }
  };

  const handleProfileClick = () => {
    setShowProfileModal(true);
    setShowUserMenu(false);
  };

  const handleSettingsClick = () => {
    // Navigate to settings - this would be handled by your routing system
    console.log('Navigate to settings');
    setShowUserMenu(false);
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center space-x-4 flex-1">
          <div className="relative max-w-md flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Lookup by Asset Tag"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md transition-colors"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                {userProfile?.avatar ? (
                  <img src={userProfile.avatar} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <span className="text-white text-sm font-medium">
                    {userProfile?.firstName?.[0] || 'U'}{userProfile?.lastName?.[0] || 'U'}
                  </span>
                )}
              </div>
              <div className="text-left">
                <div className="text-sm font-medium">{userProfile?.firstName || 'User'} {userProfile?.lastName || ''}</div>
                <div className="text-xs text-gray-500">{userProfile?.jobTitle || 'Administrator'}</div>
              </div>
              <ChevronDown className="w-4 h-4" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{userProfile?.firstName || 'User'} {userProfile?.lastName || ''}</p>
                  <p className="text-sm text-gray-500">{userProfile?.email || 'user@company.com'}</p>
                </div>
                <button
                  onClick={handleProfileClick}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={handleSettingsClick}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>
                <div className="border-t border-gray-100 mt-1 pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        profile={userProfile || {
          id: '1',
          firstName: 'User',
          lastName: '',
          email: 'user@company.com',
          username: 'user',
          department: 'IT',
          jobTitle: 'Administrator',
          location: 'Office',
          lastLogin: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          permissions: ['admin'],
          preferences: {
            theme: 'light',
            language: 'en',
            timezone: 'UTC',
            notifications: true
          }
        }}
        onUpdate={onProfileUpdate}
      />
    </>
  );
}