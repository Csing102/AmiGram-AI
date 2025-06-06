import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Cog6ToothIcon, UserPlusIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

interface Profile {
  id: string;
  username: string;
  full_name: string;
  bio?: string;
  avatar_url?: string;
  website?: string;
  posts_count: number;
  followers_count: number;
  following_count: number;
  is_following?: boolean;
}

interface Post {
  id: string;
  image_url?: string;
  likes_count: number;
  comments_count: number;
}

export default function Profile() {
  const { username } = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'posts' | 'saved'>('posts');
  const { user } = useAuthStore();

  const isOwnProfile = !username || username === user?.user_metadata?.username;

  useEffect(() => {
    fetchProfile();
    fetchPosts();
  }, [username]);

  const fetchProfile = async () => {
    try {
      let query = supabase.from('profiles').select('*');
      
      if (username) {
        query = query.eq('username', username);
      } else {
        query = query.eq('id', user?.id);
      }

      const { data, error } = await query.single();

      if (error) throw error;

      // Mock additional data
      const profileWithStats = {
        ...data,
        posts_count: Math.floor(Math.random() * 100),
        followers_count: Math.floor(Math.random() * 10000),
        following_count: Math.floor(Math.random() * 1000),
        is_following: !isOwnProfile ? Math.random() > 0.5 : undefined,
      };

      setProfile(profileWithStats);
    } catch (error: any) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      // Mock posts data
      const mockPosts = Array.from({ length: 12 }, (_, i) => ({
        id: i.toString(),
        image_url: `https://images.pexels.com/photos/${1000000 + i}/pexels-photo-${1000000 + i}.jpeg`,
        likes_count: Math.floor(Math.random() * 1000),
        comments_count: Math.floor(Math.random() * 100),
      }));
      
      setPosts(mockPosts);
    } catch (error: any) {
      toast.error('Failed to load posts');
    }
  };

  const toggleFollow = async () => {
    if (!profile) return;

    try {
      setProfile(prev => prev ? {
        ...prev,
        is_following: !prev.is_following,
        followers_count: prev.is_following 
          ? prev.followers_count - 1 
          : prev.followers_count + 1
      } : null);

      toast.success(profile.is_following ? 'Unfollowed' : 'Following');
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

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Profile Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-8">
          {/* Avatar */}
          <div className="w-32 h-32 bg-gray-300 rounded-full flex-shrink-0"></div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-4">
              <h1 className="text-2xl font-semibold text-gray-900 mb-2 sm:mb-0">
                {profile.username}
              </h1>
              
              {isOwnProfile ? (
                <button className="btn-secondary flex items-center space-x-2">
                  <Cog6ToothIcon className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={toggleFollow}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      profile.is_following
                        ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {profile.is_following ? 'Following' : 'Follow'}
                  </button>
                  <button className="btn-secondary">
                    <ChatBubbleLeftRightIcon className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex space-x-8 mb-4">
              <div className="text-center">
                <p className="font-semibold text-lg">{profile.posts_count}</p>
                <p className="text-gray-600 text-sm">posts</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-lg">{profile.followers_count.toLocaleString()}</p>
                <p className="text-gray-600 text-sm">followers</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-lg">{profile.following_count.toLocaleString()}</p>
                <p className="text-gray-600 text-sm">following</p>
              </div>
            </div>

            {/* Bio */}
            <div>
              <p className="font-semibold text-gray-900">{profile.full_name}</p>
              {profile.bio && <p className="text-gray-700 mt-1">{profile.bio}</p>}
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline mt-1 block"
                >
                  {profile.website}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center border-b border-gray-200 mb-6">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('posts')}
            className={`py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'posts'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            POSTS
          </button>
          {isOwnProfile && (
            <button
              onClick={() => setActiveTab('saved')}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'saved'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              SAVED
            </button>
          )}
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-3 gap-1">
        {posts.map((post) => (
          <div key={post.id} className="aspect-square bg-gray-200 relative group cursor-pointer">
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
              <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <span>❤️</span>
                  <span>{post.likes_count}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>💬</span>
                  <span>{post.comments_count}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">📷</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
          <p className="text-gray-500">
            {isOwnProfile ? 'Share your first photo!' : 'No posts to show'}
          </p>
        </div>
      )}
    </div>
  );
}