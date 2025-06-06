import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, HashtagIcon, UserIcon } from '@heroicons/react/24/outline';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface TrendingHashtag {
  tag: string;
  count: number;
}

interface SuggestedUser {
  id: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  followers_count: number;
  is_following: boolean;
}

export default function Explore() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'posts' | 'people' | 'tags'>('posts');
  const [trendingTags, setTrendingTags] = useState<TrendingHashtag[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrendingData();
  }, []);

  const fetchTrendingData = async () => {
    try {
      // Fetch trending hashtags (mock data for now)
      setTrendingTags([
        { tag: 'photography', count: 1234 },
        { tag: 'travel', count: 987 },
        { tag: 'food', count: 756 },
        { tag: 'art', count: 654 },
        { tag: 'nature', count: 543 },
        { tag: 'fitness', count: 432 },
      ]);

      // Fetch suggested users
      const { data: users, error } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url')
        .limit(10);

      if (error) throw error;

      // Mock followers count and following status
      const usersWithStats = users?.map(user => ({
        ...user,
        followers_count: Math.floor(Math.random() * 10000),
        is_following: false,
      })) || [];

      setSuggestedUsers(usersWithStats);
    } catch (error: any) {
      toast.error('Failed to load explore data');
    } finally {
      setLoading(false);
    }
  };

  const followUser = async (userId: string) => {
    try {
      // In a real app, this would create a follow relationship
      setSuggestedUsers(users =>
        users.map(user =>
          user.id === userId
            ? { ...user, is_following: !user.is_following }
            : user
        )
      );
      toast.success('Follow status updated!');
    } catch (error: any) {
      toast.error('Failed to update follow status');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="spinner w-8 h-8"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search AmiGram"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg">
        {(['posts', 'people', 'tags'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors capitalize ${
              activeTab === tab
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content based on active tab */}
      {activeTab === 'posts' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Trending Posts</h2>
          <div className="grid grid-cols-3 gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'people' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Suggested for you</h2>
          <div className="space-y-4">
            {suggestedUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                  <div>
                    <p className="font-semibold text-gray-900">{user.full_name}</p>
                    <p className="text-gray-500 text-sm">@{user.username}</p>
                    <p className="text-gray-400 text-xs">
                      {user.followers_count.toLocaleString()} followers
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => followUser(user.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    user.is_following
                      ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {user.is_following ? 'Following' : 'Follow'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'tags' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Trending Hashtags</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trendingTags.map((hashtag) => (
              <div key={hashtag.tag} className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <HashtagIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">#{hashtag.tag}</p>
                    <p className="text-gray-500 text-sm">
                      {hashtag.count.toLocaleString()} posts
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}