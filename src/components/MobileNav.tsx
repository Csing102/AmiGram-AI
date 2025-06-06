import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  MagnifyingGlassIcon, 
  ChatBubbleLeftRightIcon,
  UserIcon,
  SparklesIcon,
  PuzzlePieceIcon
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  MagnifyingGlassIcon as MagnifyingGlassIconSolid,
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid,
  UserIcon as UserIconSolid,
  SparklesIcon as SparklesIconSolid,
  PuzzlePieceIcon as PuzzlePieceIconSolid
} from '@heroicons/react/24/solid';

const navigation = [
  { name: 'Home', href: '/', icon: HomeIcon, iconSolid: HomeIconSolid },
  { name: 'Explore', href: '/explore', icon: MagnifyingGlassIcon, iconSolid: MagnifyingGlassIconSolid },
  { name: 'Messages', href: '/messages', icon: ChatBubbleLeftRightIcon, iconSolid: ChatBubbleLeftRightIconSolid },
  { name: 'AI Chat', href: '/ai-chat', icon: SparklesIcon, iconSolid: SparklesIconSolid },
  { name: 'Games', href: '/games', icon: PuzzlePieceIcon, iconSolid: PuzzlePieceIconSolid },
  { name: 'Profile', href: '/profile', icon: UserIcon, iconSolid: UserIconSolid },
];

export default function MobileNav() {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href || 
            (item.href === '/profile' && location.pathname.startsWith('/profile'));
          const Icon = isActive ? item.iconSolid : item.icon;
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                isActive ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}