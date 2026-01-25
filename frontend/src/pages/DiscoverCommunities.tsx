import { useEffect, useState } from 'react';
import { Users, Globe, Lock, Loader2, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { communityAPI } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

interface Community {
  _id: string;
  name: string;
  description: string;
  memberCount: number;
  isPublic: boolean;
  coverImage?: string;
}

export default function DiscoverCommunities() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      setLoading(true);
      const response = await communityAPI.getAll();
      setCommunities((response.data.data?.communities || []).filter((c: Community) => c.isPublic));
    } catch (error) {
      toast.error('Failed to load communities');
    } finally {
      setLoading(false);
    }
  };

  const filtered = communities.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen max-w-3xl mx-auto px-4 sm:px-6 lg:px-10 py-8">
      <div className="mb-8 pb-4 border-b border-[rgba(168,85,247,0.2)]">
        <h1 className="text-3xl font-bold text-[#e5e7eb] mb-2">Discover Communities</h1>
        <p className="text-[#9ca3af]">Browse and join public communities</p>
      </div>
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9ca3af]" />
          <input
            type="text"
            placeholder="Search communities..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 glass-card rounded-xl text-[#e5e7eb] placeholder-[#9ca3af] focus:outline-none focus:border-[rgba(168,85,247,0.4)]"
          />
        </div>
      </div>
      <div className="grid gap-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#a855f7]" />
          </div>
        ) : filtered.length > 0 ? (
          filtered.map((community, index) => (
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
                    <Link
                      to={`/community/${community._id}`}
                      className="px-4 py-1.5 bg-[#7c3aed] hover:bg-[#6d28d9] rounded-lg text-white text-sm font-semibold transition-colors"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-[#9ca3af] mx-auto mb-4" />
            <p className="text-[#9ca3af] mb-2">No public communities found</p>
            <p className="text-sm text-[#6b7280]">Try a different search</p>
          </div>
        )}
      </div>
    </div>
  );
}
