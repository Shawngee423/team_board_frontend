import React, { useState } from 'react';
import { ProjectComment } from '../../types/project';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';
import { Reply } from 'lucide-react';

interface CommentSectionProps {
  comments: ProjectComment[];
  projectId: number;
  onAddComment: (message: string, replyToId?: number) => Promise<void>;
}

const CommentItem: React.FC<{
  comment: ProjectComment;
  onReply: (commentId: number) => void;
}> = ({ comment, onReply }) => {
  const dateFormatted = format(new Date(comment.comment_time), 'MMM d, yyyy • h:mm a');
  
  return (
    <div className="mb-6">
      <div className="flex gap-4">
        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-500 flex-shrink-0">
          {comment.user_name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium">{comment.user_name}</span>
            <span className="text-sm text-gray-500">{dateFormatted}</span>
          </div>
          <p className="text-gray-700">{comment.comment_message}</p>
          <button 
            onClick={() => onReply(comment.comment_id)}
            className="mt-2 text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1"
          >
            <Reply size={14} /> Reply
          </button>
          
          {/* Nested comments */}
          {comment.re_list && comment.re_list.length > 0 && (
            <div className="mt-4 pl-4 border-l-2 border-gray-200">
              {comment.re_list.map(reply => (
                <div key={reply.comment_id} className="mb-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-500 flex-shrink-0 text-sm">
                      {reply.user_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{reply.user_name}</span>
                        <span className="text-xs text-gray-500">
                          {format(new Date(reply.comment_time), 'MMM d, yyyy • h:mm a')}
                        </span>
                      </div>
                      <p className="text-gray-700">{reply.comment_message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CommentSection: React.FC<CommentSectionProps> = ({ 
  comments, 
  projectId, 
  onAddComment 
}) => {
  const { isAuthenticated } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentText.trim()) return;
    
    try {
      setSubmitting(true);
      await onAddComment(commentText, replyingTo || undefined);
      setCommentText('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = (commentId: number) => {
    if (!isAuthenticated) {
      alert('Please log in to reply to comments');
      return;
    }
    
    setReplyingTo(commentId);
    
    // Focus the comment textarea
    const textarea = document.getElementById('comment-textarea');
    if (textarea) {
      textarea.focus();
    }
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-6">
        Comments ({comments.length})
      </h3>
      
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="relative">
            {replyingTo !== null && (
              <div className="absolute -top-7 left-0 text-sm text-primary-600 flex items-center">
                <span>Replying to a comment</span>
                <button 
                  type="button"
                  onClick={cancelReply}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
              </div>
            )}
            <textarea
              id="comment-textarea"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write your comment..."
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-y min-h-[100px]"
              required
            />
          </div>
          <div className="flex justify-end mt-3">
            <button
              type="submit"
              disabled={submitting}
              className={`px-5 py-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors ${
                submitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-gray-50 p-4 rounded-lg mb-8 text-center">
          <p className="text-gray-600">Please sign in to post a comment</p>
        </div>
      )}
      
      <div className="space-y-6">
        {comments.filter(c => !c.re_comment_id).map(comment => (
          <CommentItem 
            key={comment.comment_id} 
            comment={comment} 
            onReply={handleReply} 
          />
        ))}
      </div>
    </div>
  );
};

export default CommentSection;