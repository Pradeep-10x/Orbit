import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Shield, Users, LogOut, User, CheckCircle2, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { userAPI } from '@/lib/api';
import { toast } from 'react-hot-toast';

export default function RightPanel() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [friendQuery, setFriendQuery] = useState('');
  const [searching, setSearching] = useState(false);

  if (!user) return null;

  const handleAddFriend = async () => {
    const query = friendQuery.trim();
    if (!query) return;
    try {
      setSearching(true);
      const { data } = await userAPI.getUserProfile(query);
      const foundUser = data?.data;
      if (foundUser?.username) {
        toast.success(`Found ${foundUser.username}`);
        navigate(`/profile/${foundUser.username}`);
      } else {
        toast.error('User not found');
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'User not found');
    } finally {
      setSearching(false);
    }
  };

  return (
    <aside className="hidden xl:block w-80 fixed right-0 top-0 h-full border-l border-[rgba(168,85,247,0.15)] glass-panel z-30">
      <div className="p-6 space-y-6">
        {/* User Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass-card rounded-xl p-6"
        >
          <Link
            to={`/profile/${user.username}`}
            className="flex items-center gap-4 mb-4 hover:opacity-80 transition-opacity"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#a855f7] to-[#06b6d4] flex items-center justify-center overflow-hidden">
              <img src={user.avatar || "/default-avatar.jpg"} alt={user.username} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold text-[#e5e7eb] truncate">{user.username}</span>
                {user.isVerified && (
                  <span className="text-[#06b6d4] text-sm font-medium">✓</span>
                )}
              </div>
              <span className="text-base text-[#9ca3af] truncate block">{user.fullName}</span>
            </div>
          </Link>

          {/* Quick actions */}
          <div className="mb-4 flex items-center gap-3">
            <Link
              to={`/profile/${user.username}`}
              className="flex-1 flex items-center justify-center gap-2 glass-card rounded-lg px-3 py-2 hover:border-[rgba(168,85,247,0.3)] transition-colors"
            >
              <User className="w-5 h-5 text-[#e5e7eb]" />
              <span className="text-base font-semibold text-[#e5e7eb]">Profile</span>
            </Link>
            <button
              onClick={async () => {
                await logout();
                navigate('/login');
              }}
              className="flex-1 flex items-center justify-center gap-2 glass-card rounded-lg px-3 py-2 hover:border-[rgba(239,68,68,0.4)] hover:text-red-400 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-base font-semibold">Logout</span>
            </button>
          </div>

          {/* Verification Status */}
          <div className="pt-4 border-t border-[rgba(168,85,247,0.1)]">
            {user.isVerified ? (
              <div className="glass-card rounded-lg px-4 py-3 flex items-center gap-3 border border-[rgba(168,85,247,0.2)]">
                <CheckCircle2 className="w-6 h-6 text-[#06b6d4]" />
                <div className="flex-1">
                  <p className="text-[#e5e7eb] text-base font-semibold">Verified</p>
                  <p className="text-sm text-[#9ca3af]">
                    Badge: {user.VerificationBadge || 'Standard'}
                  </p>
                </div>
                <Link
                  to="/settings"
                  className="text-base text-[#a855f7] hover:text-[#c084fc] font-semibold"
                >
                  Manage
                </Link>
              </div>
            ) : (
              <Link
                to="/settings"
                className="flex items-center gap-2 px-4 py-3 glass-card rounded-lg hover:border-[rgba(168,85,247,0.3)] transition-colors group"
              >
                <Shield className="w-5 h-5 text-[#a855f7] group-hover:text-[#c084fc] transition-colors" />
                <div className="flex-1">
                  <p className="text-[#e5e7eb] font-semibold text-base">Get Verified</p>
                  <p className="text-sm text-[#9ca3af]">Boost trust and reduce spam.</p>
                </div>
              </Link>
            )}
          </div>
        </motion.div>

        {/* Add friend + suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="glass-card rounded-xl p-6 space-y-4"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Search className="w-5 h-5 text-[#9ca3af]" />
              <h3 className="text-base font-semibold text-[#e5e7eb]">Add a friend</h3>
            </div>
            <div className="flex gap-2 items-stretch">
              <input
                type="text"
                placeholder="Search by username or email"
                value={friendQuery}
                onChange={(e) => setFriendQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddFriend();
                  }
                }}
                className="flex-1 min-w-0 glass-card rounded-lg px-3 py-2 text-[#e5e7eb] placeholder-[#9ca3af] focus:outline-none focus:border-[rgba(168,85,247,0.4)]"
              />
              <button
                onClick={handleAddFriend}
                disabled={searching || !friendQuery.trim()}
                className="shrink-0 px-3 py-2 bg-[#7c3aed] hover:bg-[#6d28d9] rounded-lg text-white font-semibold transition-colors disabled:opacity-60"
              >
                {searching ? 'Searching...' : 'Add'}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-6 h-6 text-[#9ca3af]" />
              <h3 className="text-base font-semibold text-[#e5e7eb]">Suggestions</h3>
            </div>
            <p className="text-base text-[#9ca3af]">Suggestions will appear here</p>
          </div>
        </motion.div>
      </div>
    </aside>
  );
}

