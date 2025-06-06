import React, { useState } from 'react';
import { PlayIcon, TrophyIcon, UserGroupIcon } from '@heroicons/react/24/outline';

interface Game {
  id: string;
  title: string;
  description: string;
  type: '2D' | '3D';
  thumbnail: string;
  players: number;
  rating: number;
}

const games: Game[] = [
  {
    id: 'snake',
    title: 'Snake Game',
    description: 'Classic snake game with modern graphics',
    type: '2D',
    thumbnail: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
    players: 1247,
    rating: 4.5,
  },
  {
    id: 'tetris',
    title: 'Tetris',
    description: 'The timeless puzzle game',
    type: '2D',
    thumbnail: 'https://images.pexels.com/photos/1040157/pexels-photo-1040157.jpeg',
    players: 892,
    rating: 4.7,
  },
  {
    id: 'cube-runner',
    title: 'Cube Runner 3D',
    description: 'Navigate through a 3D obstacle course',
    type: '3D',
    thumbnail: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg',
    players: 634,
    rating: 4.2,
  },
  {
    id: 'space-shooter',
    title: 'Space Shooter',
    description: 'Defend Earth from alien invasion',
    type: '2D',
    thumbnail: 'https://images.pexels.com/photos/586063/pexels-photo-586063.jpeg',
    players: 1156,
    rating: 4.4,
  },
  {
    id: 'racing-3d',
    title: 'Racing 3D',
    description: 'High-speed 3D racing experience',
    type: '3D',
    thumbnail: 'https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg',
    players: 2341,
    rating: 4.6,
  },
  {
    id: 'puzzle-master',
    title: 'Puzzle Master',
    description: 'Mind-bending puzzle challenges',
    type: '2D',
    thumbnail: 'https://images.pexels.com/photos/278918/pexels-photo-278918.jpeg',
    players: 567,
    rating: 4.3,
  },
];

export default function Games() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | '2D' | '3D'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGames = games.filter(game => {
    const matchesCategory = selectedCategory === 'all' || game.type === selectedCategory;
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         game.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const playGame = (gameId: string) => {
    // In a real app, this would launch the game
    alert(`Launching ${games.find(g => g.id === gameId)?.title}...`);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mini Games</h1>
        <p className="text-gray-600">Play amazing 2D and 3D games right in your browser</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search games..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex space-x-2">
          {(['all', '2D', '3D'] as const).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category === 'all' ? 'All Games' : `${category} Games`}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <PlayIcon className="w-8 h-8 text-blue-500 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{games.length}</p>
              <p className="text-gray-600">Total Games</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <UserGroupIcon className="w-8 h-8 text-green-500 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {games.reduce((sum, game) => sum + game.players, 0).toLocaleString()}
              </p>
              <p className="text-gray-600">Active Players</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <TrophyIcon className="w-8 h-8 text-yellow-500 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {(games.reduce((sum, game) => sum + game.rating, 0) / games.length).toFixed(1)}
              </p>
              <p className="text-gray-600">Average Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGames.map((game) => (
          <div key={game.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-gray-200 relative overflow-hidden">
              <img
                src={game.thumbnail}
                alt={game.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <button
                  onClick={() => playGame(game.id)}
                  className="bg-white text-gray-900 px-6 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors flex items-center space-x-2"
                >
                  <PlayIcon className="w-4 h-4" />
                  <span>Play Now</span>
                </button>
              </div>
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  game.type === '3D' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {game.type}
                </span>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">{game.title}</h3>
              <p className="text-gray-600 text-sm mb-3">{game.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <UserGroupIcon className="w-4 h-4" />
                    <span>{game.players.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>⭐</span>
                    <span>{game.rating}</span>
                  </div>
                </div>
                
                <button
                  onClick={() => playGame(game.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                >
                  Play
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredGames.length === 0 && (
        <div className="text-center py-12">
          <PlayIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No games found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
}