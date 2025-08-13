import API from '../services/api';
import { useState } from 'react';
import CommentSection from './CommentSection';
import '../styles/Post.css';
import scaryImg from '../assets/scary.jpg';
import funnyImg from '../assets/funny.jpg';
import adventureImg from '../assets/adventure.jpg';
import fantasyImg from '../assets/fantasy.jpg';
import otherImg from '../assets/other.jpg';
import { FaRegThumbsUp, FaRegComment, FaTrashAlt } from 'react-icons/fa';

const CATEGORY_IMAGES = {
  Scary: scaryImg,
  Funny: funnyImg,
  Adventure: adventureImg,
  Fantasy: fantasyImg,
  Other: otherImg
};

function getInitial(name) {
  return name ? name[0].toUpperCase() : '?';
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit'
  });
}

export default function Post({ post, currentUser, onUpdate }) {
  const [showComments, setShowComments] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const snippet = post.content.length > 100
    ? post.content.slice(0, 100) + '...'
    : post.content;

  console.log('Post component rendering:', { 
    postId: post.id, 
    comments: post.comments, 
    commentsCount: post.comments?.length || 0 
  });

  const handleLike = async () => {
    await API.post(`/Dreams/${post.id}/like`);
    onUpdate();
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this post?')) {
      await API.delete(`/Dreams/${post.id}`);
      onUpdate();
    }
  };

  // Prevent modal open when clicking action buttons
  const handleCardClick = (e) => {
    // Only open modal if not clicking a button or inside post-actions
    if (
      e.target.closest('.post-actions') ||
      e.target.classList.contains('read-more')
    ) {
      return;
    }
    setShowModal(true);
  };

  return (
    <>
      <div className="post" onClick={handleCardClick} tabIndex={0} style={{cursor:'pointer'}}>
        <div className="post-image-container">
          <img src={CATEGORY_IMAGES[post.category] || otherImg} alt={post.category} className="post-category-img" />
          <div className="post-overlay">
            <div className="post-title">{post.title}</div>
            <div className="post-snippet">{snippet} {post.content.length > 100 && <span className="read-more" onClick={() => setShowModal(true)}>Read more</span>}</div>
            <div className="post-user-row">
              {post.avatarUrl
                ? <img src={post.avatarUrl} alt="avatar" className="post-avatar" />
                : <div className="post-avatar initials">{getInitial(post.username)}</div>
              }
              <span className="post-user">
                Posted on {formatDate(post.createdAt)} by {post.username}
              </span>
            </div>
          </div>
        </div>
        <div className="post-actions" onClick={e => e.stopPropagation()}>
          <button onClick={handleLike} title="Like">
            <FaRegThumbsUp style={{marginRight: '0.4em'}} />
            {post.likes?.length || 0}
          </button>
          <button onClick={() => setShowComments(v => !v)} title="Show Comments">
            <FaRegComment style={{marginRight: '0.4em'}} />
            {showComments ? 'Hide' : 'Show'}
            {' '}({post.comments?.length || 0})
          </button>
          {(currentUser?.role === 'Admin' || currentUser?.id === post.userId) && (
            <button onClick={handleDelete} className="delete" title="Delete">
              <FaTrashAlt style={{marginRight: '0.4em'}} />
              Delete
            </button>
          )}
        </div>
        {showComments && (
          <CommentSection 
            postId={post.id} 
            comments={post.comments || []} 
            onUpdate={onUpdate} 
          />
        )}
      </div>
      {showModal && (
        <div className="dream-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="dream-modal" onClick={e => e.stopPropagation()} tabIndex={0}>
            <button className="dream-modal-close" onClick={() => setShowModal(false)} aria-label="Close modal">&times;</button>
            <div className="dream-modal-title">{post.title}</div>
            <div className="dream-modal-author">By {post.username}</div>
            <div className="dream-modal-content">{post.content}</div>
            <CommentSection 
              postId={post.id} 
              comments={post.comments || []} 
              onUpdate={onUpdate} 
            />
          </div>
        </div>
      )}
    </>
  );
} 