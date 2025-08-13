import { useState, useEffect } from 'react';
import API from '../services/api';
import '../styles/CommentSection.css';

export default function CommentSection({ postId, comments = [], onUpdate }) {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [localComments, setLocalComments] = useState(comments);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('CommentSection mounted with postId:', postId, 'comments:', comments);
    setLocalComments(comments);
  }, [comments, postId]);

  const fetchComments = async () => {
    console.log('Fetching comments for dream:', postId);
    try {
      const response = await API.get(`/Comments/dream/${postId}`);
      console.log('Comments response:', response.data);
      setLocalComments(response.data || []);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
      console.error('Error details:', err.response?.data);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    console.log('Adding comment:', { content, dreamId: postId });
    try {
      const response = await API.post('/Comments', { content, dreamId: postId });
      console.log('Comment added successfully:', response.data);
      setContent('');
      // Fetch updated comments
      await fetchComments();
      // Also call the parent's onUpdate to refresh the entire post
      onUpdate && onUpdate();
    } catch (err) {
      console.error('Comment error:', err);
      console.error('Error response:', err.response?.data);
      setError('Failed to comment.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this comment?')) {
      try {
        console.log('Deleting comment:', id);
      await API.delete(`/Comments/${id}`);
        console.log('Comment deleted successfully');
        // Fetch updated comments
        await fetchComments();
        // Also call the parent's onUpdate to refresh the entire post
      onUpdate && onUpdate();
      } catch (err) {
        console.error('Failed to delete comment:', err);
      }
    }
  };

  console.log('Rendering CommentSection with localComments:', localComments);

  return (
    <div className="comment-section">
      <form onSubmit={handleAdd} className="comment-form">
        <input
          type="text"
          placeholder="Add a comment..."
          value={content}
          onChange={e => setContent(e.target.value)}
          required
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Posting...' : 'Comment'}
        </button>
      </form>
      {error && <div className="error">{error}</div>}
      <div className="comments-list">
        {localComments && localComments.length > 0 ? (
          localComments.map(c => (
          <div key={c.id} className="comment">
            <span><b>{c.username}:</b> {c.content}</span>
            <span className="comment-date">{new Date(c.createdAt).toLocaleString()}</span>
            <button onClick={() => handleDelete(c.id)} className="delete">Delete</button>
          </div>
          ))
        ) : (
          <p className="no-comments">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
} 