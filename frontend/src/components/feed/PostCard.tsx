import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Bookmark, MoreHorizontal, ChevronDown, ChevronUp, Send, Loader2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { likeAPI, commentAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
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

interface Comment {
  _id: string;
  user: {
    _id: string;
    username: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
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
  const { user: currentUser } = useAuthStore();
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);

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

  const fetchComments = async () => {
    if (comments.length > 0) return; // Already fetched
    try {
      setLoadingComments(true);
      const response = await commentAPI.getPostComments(post._id);
      setComments(response.data.data?.comments || response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleToggleComments = () => {
    if (!showComments) {
      fetchComments();
    }
    setShowComments(!showComments);
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || submittingComment) return;

    try {
      setSubmittingComment(true);
      const response = await commentAPI.createPostComment(post._id, newComment.trim());
      const createdComment = response.data.data;
      setComments((prev) => [createdComment, ...prev]);
      setCommentsCount((prev) => prev + 1);
      setNewComment('');
    } catch (error) {
      console.error('Failed to post comment:', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      setDeletingCommentId(commentId);
      await commentAPI.deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      setCommentsCount((prev) => prev - 1);
    } catch (error) {
      console.error('Failed to delete comment:', error);
    } finally {
      setDeletingCommentId(null);
    }
  };

  const canDeleteComment = (comment: Comment) => {
    if (!currentUser) return false;
    // User can delete if they are the comment author or the post owner
    return comment.user._id === currentUser._id || post.user._id === currentUser._id;
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
          <button
            onClick={handleToggleComments}
            className="flex items-center gap-1 text-[#9ca3af] hover:text-[#e5e7eb] transition-colors"
          >
            <span className="text-sm font-medium">{commentsCount}</span>
            <MessageCircle className="w-6 h-6" />
            {showComments ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button className="text-[#9ca3af] hover:text-[#e5e7eb] transition-colors ml-auto">
            <Bookmark className="w-6 h-6" />
          </button>
        </div>

        {/* Comments Section */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-4 border-t border-[rgba(168,85,247,0.1)] pt-4">
                {/* Add Comment Form */}
                <form onSubmit={handleSubmitComment} className="flex items-center gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1 bg-[rgba(168,85,247,0.05)] border border-[rgba(168,85,247,0.1)] rounded-lg px-3 py-2 text-sm text-[#e5e7eb] placeholder-[#9ca3af] focus:outline-none focus:border-[rgba(168,85,247,0.3)]"
                  />
                  <button
                    type="submit"
                    disabled={!newComment.trim() || submittingComment}
                    className="p-2 bg-[#7c3aed] hover:bg-[#6d28d9] rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {submittingComment ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </form>

                {/* Comments List */}
                {loadingComments ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="w-6 h-6 animate-spin text-[#a855f7]" />
                  </div>
                ) : comments.length > 0 ? (
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {comments.map((comment) => (
                      <div key={comment._id} className="flex gap-3">
                        <Link to={`/profile/${comment.user.username}`}>
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#a855f7] to-[#06b6d4] flex-shrink-0 overflow-hidden">
                            <img
                              src={comment.user.avatar || "/default-avatar.jpg"}
                              alt={comment.user.username}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </Link>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Link
                                to={`/profile/${comment.user.username}`}
                                className="font-semibold text-sm text-[#e5e7eb] hover:underline"
                              >
                                {comment.user.username}
                              </Link>
                              <span className="text-xs text-[#9ca3af]">
                                {formatDistanceToNow(new Date(comment.createdAt))}
                              </span>
                            </div>
                            {canDeleteComment(comment) && (
                              <button
                                onClick={() => handleDeleteComment(comment._id)}
                                disabled={deletingCommentId === comment._id}
                                className="text-[#9ca3af] hover:text-red-500 transition-colors p-1"
                                title="Delete comment"
                              >
                                {deletingCommentId === comment._id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </button>
                            )}
                          </div>
                          <p className="text-sm text-[#e5e7eb] break-words">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-[#9ca3af] text-sm py-4">No comments yet. Be the first to comment!</p>
                )}

                {/* View All Comments Link */}
                {commentsCount > 3 && (
                  <Link
                    to={`/post/${post._id}`}
                    className="block text-center text-sm text-[#a855f7] hover:underline mt-3"
                  >
                    View all {commentsCount} comments
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  );
}

