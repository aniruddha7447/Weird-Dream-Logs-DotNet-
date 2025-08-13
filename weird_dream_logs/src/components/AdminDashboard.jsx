import { useState, useEffect } from 'react';
import API from '../services/api';
import Post from './Post';
import '../styles/AdminDashboard.css';

export default function AdminDashboard({ user }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await API.get('/Dreams');
      setPosts(res.data);
    } catch (err) {}
    setLoading(false);
  };

  return (
    <div className="admin-dashboard-container">
      <div className="admin-dashboard-card">
        <h2>Admin Dashboard</h2>
        {loading ? <p>Loading...</p> : (
          <div className="posts-list-grid">
            {posts.map(post => (
              <Post key={post.id} post={post} currentUser={user} onUpdate={fetchPosts} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 