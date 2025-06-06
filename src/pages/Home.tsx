import React, { useState, useEffect } from 'react';
import { HeartIcon, ChatBubbleOvalLeftIcon, PaperAirplaneIcon, BookmarkIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

interface Post {
  id: string;
  content: string;
  image_url?: string;
  created_at: string;
  user: {
    id: string;
    username: string;
    full_name: string;
    avatar_url?: string;
  };
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          user:profiles(id, username, full_name, avatar_url),
          likes_count:likes(count),
          comments_count:comments(count),
          is_liked:likes!inner(user_id)
        `)
        .eq('likes.user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error: any) {
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async (postId: string) => {
    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      if (post.is_liked) {
        await supabase
          .from('likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user?.id);
      } else {
        await supabase
          .from('likes')
          .insert({ post_id: postId, user_id: user?.id });
      }

      // Update local state
      setPosts(posts.map(p => 
        p.id === postId 
          ? { 
              ...p, 
              is_liked: !p.is_liked,
              likes_count: p.is_liked ? p.likes_count - 1 : p.likes_count + 1
            }
          : p
      ));
    } catch (error: any) {
      toast.error('Failed to update like');
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
    <div className="max-w-2xl mx-auto py-6 px-4">
      {/* Stories */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex space-x-4 overflow-x-auto">
          <div className="flex-shrink-0 text-center">
            <div className="story-ring w-16 h-16 rounded-full flex items-center justify-center">
              <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-2xl">+</span>
              </div>
            </div>
            <p className="text-xs mt-1">Your story</p>
          </div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex-shrink-0 text-center">
              <div className="story-ring w-16 h-16 rounded-full flex items-center justify-center">
                <div className="w-14 h-14 bg-gray-300 rounded-full"></div>
              </div>
              <p className="text-xs mt-1">user{i}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-6">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No posts yet. Start following people to see their posts!</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg border border-gray-200">
              {/* Post header */}
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                  <div>
                    <p className="font-semibold text-sm">{post.user.username}</p>
                    <p className="text-gray-500 text-xs">{new Date(post.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
              </div>

              {/* Post image */}
              {post.image_url && (
                <div className="aspect-square bg-gray-100">
                  <img 
                    src={post.image_url} 
                    alt="Post" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Post actions */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={() => toggleLike(post.id)}
                      className="hover:text-red-500 transition-colors"
                    >
                      {post.is_liked ? (
                        <HeartIconSolid className="w-6 h-6 text-red-500" />
                      ) : (
                        <HeartIcon className="w-6 h-6" />
                      )}
                    </button>
                    <button className="hover:text-gray-600">
                      <ChatBubbleOvalLeftIcon className="w-6 h-6" />
                    </button>
                    <button className="hover:text-gray-600">
                      <PaperAirplaneIcon className="w-6 h-6" />
                    </button>
                  </div>
                  <button className="hover:text-gray-600">
                    <BookmarkIcon className="w-6 h-6" />
                  </button>
                </div>

                {/* Likes count */}
                <p className="font-semibold text-sm mb-2">
                  {post.likes_count} {post.likes_count === 1 ? 'like' : 'likes'}
                </p>

                {/* Post content */}
                <div className="text-sm">
                  <span className="font-semibold">{post.user.username}</span>
                  <span className="ml-2">{post.content}</span>
                </div>

                {/* Comments */}
                {post.comments_count > 0 && (
                  <button className="text-gray-500 text-sm mt-2">
                    View all {post.comments_count} comments
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}