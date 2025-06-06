import React, { useState, useEffect, useRef } from 'react';
import { PaperAirplaneIcon, Cog6ToothIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
}

const defaultModels: AIModel[] = [
  { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI', description: 'Most capable model' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI', description: 'Fast and efficient' },
  { id: 'claude-3', name: 'Claude 3', provider: 'Anthropic', description: 'Great for analysis' },
  { id: 'deepseek-coder', name: 'DeepSeek Coder', provider: 'DeepSeek', description: 'Specialized for coding' },
];

export default function AIChat() {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gpt-4');
  const [showSettings, setShowSettings] = useState(false);
  const [apiKeys, setApiKeys] = useState({
    openai: '',
    anthropic: '',
    deepseek: '',
    openrouter: '',
    huggingface: '',
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    loadApiKeys();
    loadChatHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadApiKeys = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_settings')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (data) {
        setApiKeys(data.api_keys || {});
        setSelectedModel(data.selected_model || 'gpt-4');
      }
    } catch (error) {
      // Settings don't exist yet, that's fine
    }
  };

  const saveApiKeys = async () => {
    try {
      const { error } = await supabase
        .from('ai_settings')
        .upsert({
          user_id: user?.id,
          api_keys: apiKeys,
          selected_model: selectedModel,
        });

      if (error) throw error;
      toast.success('Settings saved!');
      setShowSettings(false);
    } catch (error: any) {
      toast.error('Failed to save settings');
    }
  };

  const loadChatHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_conversations')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: true });

      if (data) {
        const formattedMessages = data.map(msg => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          timestamp: new Date(msg.created_at),
        }));
        setMessages(formattedMessages);
      }
    } catch (error: any) {
      toast.error('Failed to load chat history');
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: newMessage.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setLoading(true);

    try {
      // Save user message
      await supabase
        .from('ai_conversations')
        .insert({
          user_id: user?.id,
          role: 'user',
          content: userMessage.content,
        });

      // Simulate AI response (replace with actual API call)
      const aiResponse = await simulateAIResponse(userMessage.content);
      
      const assistantMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Save AI response
      await supabase
        .from('ai_conversations')
        .insert({
          user_id: user?.id,
          role: 'assistant',
          content: assistantMessage.content,
        });

    } catch (error: any) {
      toast.error('Failed to get AI response');
    } finally {
      setLoading(false);
    }
  };

  const simulateAIResponse = async (message: string): Promise<string> => {
    // This is a placeholder. In a real app, you'd call the actual AI API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (message.toLowerCase().includes('code')) {
      return `Here's a simple example:

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));
\`\`\`

This function takes a name parameter and returns a greeting message. Would you like me to explain any part of this code or help you with something more specific?`;
    }
    
    return `I understand you're asking about "${message}". As an AI assistant, I'm here to help you with various tasks including coding, analysis, creative writing, and problem-solving. 

How can I assist you further with this topic?`;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const clearChat = async () => {
    try {
      await supabase
        .from('ai_conversations')
        .delete()
        .eq('user_id', user?.id);
      
      setMessages([]);
      toast.success('Chat cleared!');
    } catch (error: any) {
      toast.error('Failed to clear chat');
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Settings Panel */}
      {showSettings && (
        <div className="w-80 border-r border-gray-200 p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">AI Settings</h2>
            <button
              onClick={() => setShowSettings(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          {/* Model Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Model
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {defaultModels.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name} - {model.provider}
                </option>
              ))}
            </select>
          </div>

          {/* API Keys */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">API Keys</h3>
            
            {Object.entries(apiKeys).map(([provider, key]) => (
              <div key={provider}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                  {provider} API Key
                </label>
                <input
                  type="password"
                  value={key}
                  onChange={(e) => setApiKeys(prev => ({ ...prev, [provider]: e.target.value }))}
                  placeholder={`Enter your ${provider} API key`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-2">
            <button
              onClick={saveApiKeys}
              className="w-full btn-primary"
            >
              Save Settings
            </button>
            <button
              onClick={clearChat}
              className="w-full btn-secondary"
            >
              Clear Chat History
            </button>
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <SparklesIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-semibold">AI Assistant</h1>
              <p className="text-sm text-gray-500">
                Using {defaultModels.find(m => m.id === selectedModel)?.name}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <Cog6ToothIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <SparklesIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Welcome to AI Chat
              </h3>
              <p className="text-gray-500">
                Ask me anything! I can help with coding, analysis, creative writing, and more.
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-3xl ${message.role === 'user' ? 'ml-12' : 'mr-12'}`}>
                  <div
                    className={`p-4 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 px-2">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
          
          {loading && (
            <div className="flex justify-start">
              <div className="max-w-3xl mr-12">
                <div className="bg-gray-100 p-4 rounded-2xl">
                  <div className="flex items-center space-x-2">
                    <div className="spinner w-4 h-4"></div>
                    <span className="text-gray-600">AI is thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={sendMessage} className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || loading}
              className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}