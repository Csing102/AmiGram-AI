import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  MagnifyingGlassIcon, 
  ChatBubbleLeftRightIcon,
  UserIcon,
  Cog6ToothIcon,
  SparklesIcon,
  PuzzlePieceIcon
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  MagnifyingGlassIcon as MagnifyingGlassIconSolid,
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid,
  UserIcon as UserIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
  SparklesIcon as SparklesIconSolid,
  PuzzlePieceIcon as PuzzlePieceIconSolid
} from '@heroicons/react/24/solid';
import { useAuthStore } from '../stores/authStore';

const navigation = [
  { name: 'Home', href: '/', icon: HomeIcon, iconSolid: HomeIconSolid },
  { name: 'Explore', href: '/explore', icon: MagnifyingGlassIcon, iconSolid: MagnifyingGlassIconSolid },
  { name: 'Messages', href: '/messages', icon: ChatBubbleLeftRightIcon, iconSolid: ChatBubbleLeftRightIconSolid },
  { name: 'AI Chat', href: '/ai-chat', icon: SparklesIcon, iconSolid: SparklesIconSolid },
  { name: 'Games', href: '/games', icon: PuzzlePieceIcon, iconSolid: PuzzlePieceIconSolid },
  { name: 'Profile', href: '/profile', icon: UserIcon, iconSolid: UserIconSolid },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon, iconSolid: Cog6ToothIconSolid },
];

export default function Sidebar() {
  const location = useLocation();
  const { signOut } = useAuthStore();

  return (
    <div className="flex flex-col w-full h-full bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="text-xl font-bold gradient-text">AmiGram</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href || 
            (item.href === '/profile' && location.pathname.startsWith('/profile'));
          const Icon = isActive ? item.iconSolid : item.icon;
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`nav-link ${isActive ? 'active' : ''}`}
            >
              <Icon className="w-6 h-6" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="px-4 py-4 border-t border-gray-200">
        <button
          onClick={signOut}
          className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}