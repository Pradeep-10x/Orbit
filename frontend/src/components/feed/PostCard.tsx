import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Bookmark, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { likeAPI } from '@/lib/api';
// Simple date formatter (replacing date-fns to avoid dependency)
const formatDistanceToNow = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return `${Math.floor(diffInSeconds / 604800)}w ago`;
};

interface PostUser {
  _id: string;
  username: string;
  avatar?: string;
  isVerified?: boolean;
}

interface Post {
  _id: string;
  user: PostUser;
  caption?: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  isLiked?: boolean;
}

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
}

export default function PostCard({ post, onLike }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const handleLike = async () => {
    // Optimistic update
    setIsLiked(!isLiked);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
    
    try {
      await likeAPI.likeUnlikePost(post._id);
      onLike?.(post._id);
    } catch (error) {
      // Revert on error
      setIsLiked(isLiked);
      setLikesCount((prev) => (!isLiked ? prev - 1 : prev + 1));
      console.error('Failed to like post:', error);
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card rounded-xl overflow-hidden mb-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[rgba(168,85,247,0.1)]">
        <Link
          to={`/profile/${post.user.username}`}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#a855f7] to-[#06b6d4] flex items-center justify-center overflow-hidden">
            <img
              src={post.user.avatar || "/default-avatar.jpg"}
              alt={post.user.username}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#e5e7eb]">{post.user.username}</span>
              {post.user.isVerified && (
                <span className="text-[#06b6d4] text-xs font-medium">✓</span>
              )}
            </div>
            <span className="text-xs text-[#9ca3af]">
              {formatDistanceToNow(new Date(post.createdAt))}
            </span>
          </div>
        </Link>
        <button className="text-[#9ca3af] hover:text-[#e5e7eb] transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Caption */}
      {post.caption && (
        <div className="px-2 py-2 text-lg text-[#e5e7eb] border-b border-[rgba(168,85,247,0.1)]">
          
          <span>{post.caption}</span>
        </div>
      )}

      {/* Media */}
      <div className="relative bg-[#0a0a12] aspect-[30/17] flex items-center justify-center">
        {post.mediaType === 'image' ? (
          <img
            src={post.mediaUrl}
            alt={post.caption || 'Post image'}
            className="w-full h-full object-contain"
          />
        ) : (
          <video
            src={post.mediaUrl}
            className="w-full h-full object-contain"
            controls
            muted={!isVideoPlaying}
            onPlay={() => setIsVideoPlaying(true)}
            onPause={() => setIsVideoPlaying(false)}
          />
        )}
      </div>

      {/* Actions */}
      <div className="p-4">
        <div className="flex items-center gap-4">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 transition-all duration-200 ${isLiked ? 'text-red-500' : 'text-[#9ca3af] hover:text-red-500'
              }`}
          >
            <span className="text-sm font-medium">{likesCount}</span>
            <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
          </button>
          <Link
            to={`/post/${post._id}`}
            className="flex items-center gap-1 text-[#9ca3af] hover:text-[#e5e7eb] transition-colors"
          >
            <span className="text-sm font-medium">{post.commentsCount}</span>
            <MessageCircle className="w-6 h-6" />
          </Link>
          <button className="text-[#9ca3af] hover:text-[#e5e7eb] transition-colors ml-auto">
            <Bookmark className="w-6 h-6" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}

