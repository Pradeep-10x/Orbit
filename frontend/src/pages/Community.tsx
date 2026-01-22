import { useState, useRef } from 'react';
import { Users, Search, TrendingUp, Globe, Lock, Plus, Loader2, X, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import { communityAPI } from '@/lib/api';
import { toast } from 'react-hot-toast';

interface Community {
  _id: string;
  name: string;
  description: string;
  memberCount: number;
  isPublic: boolean;
  coverImage?: string;
}

export default function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'discover' | 'joined'>('discover');
  const [communities, setCommunities] = useState<Community[]>([]);
  const [joinedCommunities, setJoinedCommunities] = useState<Community[]>([]);
  const [loadingCommunities, setLoadingCommunities] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState<string | null>(null);
  
  // Create community form
  const [newCommunity, setNewCommunity] = useState({
    name: '',
    description: '',
    isPublic: true,
  });
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Suppress unused warnings - these will be used when API is integrated
  void setCommunities;
  void setJoinedCommunities;
  void setLoadingCommunities;

  const filteredCommunities = communities.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredJoinedCommunities = joinedCommunities.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleJoinCommunity = async (communityId: string) => {
    try {
      setJoining(communityId);
      await communityAPI.joinCommunity(communityId);
      toast.success('Successfully joined community!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to join community');
    } finally {
      setJoining(null);
    }
  };

  const handleCreateCommunity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommunity.name.trim()) {
      toast.error('Community name is required');
      return;
    }

    try {
      setCreating(true);
      const formData = new FormData();
      formData.append('name', newCommunity.name);
      formData.append('description', newCommunity.description);
      formData.append('isPublic', String(newCommunity.isPublic));
      if (coverImage) {
        formData.append('coverImage', coverImage);
      }

      await communityAPI.create(formData);
      toast.success('Community created successfully!');
      setShowCreateModal(false);
      setNewCommunity({ name: '', description: '', isPublic: true });
      setCoverImage(null);
      setCoverPreview(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create community');
    } finally {
      setCreating(false);
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#e5e7eb] mb-2">Community</h1>
          <p className="text-[#9ca3af]">Connect with people who share your interests</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9ca3af]" />
            <input
              type="text"
              placeholder="Search communities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 glass-card rounded-xl text-[#e5e7eb] placeholder-[#9ca3af] focus:outline-none focus:border-[rgba(168,85,247,0.4)]"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex gap-2 p-1 glass-card rounded-lg w-fit">
            <button
              onClick={() => setActiveTab('discover')}
              className={`py-2 px-4 rounded-md text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${activeTab === 'discover'
                ? 'bg-[#7c3aed] text-white'
                : 'text-[#9ca3af] hover:text-[#e5e7eb]'
                }`}
            >
              <TrendingUp className="w-4 h-4" />
              Discover
            </button>
            <button
              onClick={() => setActiveTab('joined')}
              className={`py-2 px-4 rounded-md text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${activeTab === 'joined'
                ? 'bg-[#7c3aed] text-white'
                : 'text-[#9ca3af] hover:text-[#e5e7eb]'
                }`}
            >
              <Users className="w-4 h-4" />
              Joined
            </button>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="py-2 px-4 rounded-lg bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-sm font-semibold transition-all duration-200 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Community
          </button>
        </div>

        {/* Communities Grid */}
        <div className="grid gap-4">
          {loadingCommunities ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#a855f7]" />
            </div>
          ) : activeTab === 'discover' ? (
            filteredCommunities.length > 0 ? (
              filteredCommunities.map((community, index) => (
                <motion.div
                  key={community._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="glass-card rounded-xl p-5 hover:border-[rgba(168,85,247,0.3)] transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-[#7c3aed]/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {community.coverImage ? (
                        <img src={community.coverImage} alt={community.name} className="w-full h-full object-cover" />
                      ) : (
                        <Users className="w-7 h-7 text-[#a855f7]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-[#e5e7eb] text-lg">{community.name}</h3>
                        {community.isPublic ? (
                          <Globe className="w-4 h-4 text-[#9ca3af]" />
                        ) : (
                          <Lock className="w-4 h-4 text-[#9ca3af]" />
                        )}
                      </div>
                      <p className="text-[#9ca3af] text-sm mb-3">{community.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#9ca3af]">
                          {(community.memberCount || 0).toLocaleString()} members
                        </span>
                        <button 
                          onClick={() => handleJoinCommunity(community._id)}
                          disabled={joining === community._id}
                          className="px-4 py-1.5 bg-[#7c3aed] hover:bg-[#6d28d9] rounded-lg text-white text-sm font-semibold transition-colors disabled:opacity-50"
                        >
                          {joining === community._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            'Join'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-[#9ca3af] mx-auto mb-4" />
                <p className="text-[#9ca3af] mb-2">No communities found</p>
                <p className="text-sm text-[#6b7280]">Be the first to create one!</p>
              </div>
            )
          ) : filteredJoinedCommunities.length > 0 ? (
            filteredJoinedCommunities.map((community, index) => (
              <motion.div
                key={community._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="glass-card rounded-xl p-5 hover:border-[rgba(168,85,247,0.3)] transition-all cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-[#7c3aed]/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {community.coverImage ? (
                      <img src={community.coverImage} alt={community.name} className="w-full h-full object-cover" />
                    ) : (
                      <Users className="w-7 h-7 text-[#a855f7]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-[#e5e7eb] text-lg">{community.name}</h3>
                      {community.isPublic ? (
                        <Globe className="w-4 h-4 text-[#9ca3af]" />
                      ) : (
                        <Lock className="w-4 h-4 text-[#9ca3af]" />
                      )}
                    </div>
                    <p className="text-[#9ca3af] text-sm mb-3">{community.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#9ca3af]">
                        {(community.memberCount || 0).toLocaleString()} members
                      </span>
                      <span className="px-3 py-1 bg-[#22c55e]/20 text-[#22c55e] text-sm font-medium rounded-lg">
                        Joined
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-[#9ca3af] mx-auto mb-4" />
              <p className="text-[#9ca3af] mb-4">You haven't joined any communities yet</p>
              <button
                onClick={() => setActiveTab('discover')}
                className="px-6 py-2 bg-[#7c3aed] hover:bg-[#6d28d9] rounded-lg text-white font-semibold transition-colors"
              >
                Discover Communities
              </button>
            </div>
          )}
        </div>

        {/* Create Community Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-2xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#e5e7eb]">Create Community</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-[#9ca3af] hover:text-[#e5e7eb]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateCommunity} className="space-y-4">
                {/* Cover Image */}
                <div>
                  <label className="block text-sm text-[#9ca3af] mb-2">Cover Image</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-video rounded-xl border-2 border-dashed border-[rgba(168,85,247,0.3)] flex items-center justify-center cursor-pointer hover:border-[rgba(168,85,247,0.5)] transition-colors overflow-hidden"
                  >
                    {coverPreview ? (
                      <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-[#9ca3af] mx-auto mb-2" />
                        <p className="text-sm text-[#9ca3af]">Click to upload</p>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageChange}
                    className="hidden"
                  />
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm text-[#9ca3af] mb-2">Community Name</label>
                  <input
                    type="text"
                    value={newCommunity.name}
                    onChange={(e) => setNewCommunity({ ...newCommunity, name: e.target.value })}
                    placeholder="Enter community name"
                    className="w-full glass-card rounded-lg px-4 py-3 text-[#e5e7eb] placeholder-[#9ca3af] focus:outline-none focus:border-[rgba(168,85,247,0.4)]"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm text-[#9ca3af] mb-2">Description</label>
                  <textarea
                    value={newCommunity.description}
                    onChange={(e) => setNewCommunity({ ...newCommunity, description: e.target.value })}
                    placeholder="What's your community about?"
                    rows={3}
                    className="w-full glass-card rounded-lg px-4 py-3 text-[#e5e7eb] placeholder-[#9ca3af] focus:outline-none focus:border-[rgba(168,85,247,0.4)] resize-none"
                  />
                </div>

                {/* Privacy */}
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setNewCommunity({ ...newCommunity, isPublic: true })}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                      newCommunity.isPublic
                        ? 'bg-[#7c3aed] text-white'
                        : 'glass-card text-[#9ca3af]'
                    }`}
                  >
                    <Globe className="w-4 h-4" />
                    Public
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewCommunity({ ...newCommunity, isPublic: false })}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                      !newCommunity.isPublic
                        ? 'bg-[#7c3aed] text-white'
                        : 'glass-card text-[#9ca3af]'
                    }`}
                  >
                    <Lock className="w-4 h-4" />
                    Private
                  </button>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={creating || !newCommunity.name.trim()}
                  className="w-full py-3 bg-[#7c3aed] hover:bg-[#6d28d9] rounded-lg text-white font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {creating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Community'
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
