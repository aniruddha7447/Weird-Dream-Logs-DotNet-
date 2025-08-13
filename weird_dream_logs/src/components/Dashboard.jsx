import { useState, useEffect } from 'react';
import API from '../services/api';
import Post from './Post';
import PostForm from './PostForm';
import UserSearch from './UserSearch';
import '../styles/Profile.css';
import '../styles/Dashboard.css';

const CATEGORIES = [
  'All',
  'Scary',
  'Funny',
  'Adventure',
  'Fantasy',
  'Other'
];

export default function Dashboard({ user }) {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [activeTab, setActiveTab] = useState('feed');
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    fetchPosts();
    fetchUsers();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      console.log('Fetching posts for user:', user.id);
      const res = await API.get(`/Dreams?userId=${user.id}`);
      console.log('Posts response:', res.data);
      const filteredPosts = res.data.filter(p => p.userId !== user.id);
      console.log('Filtered posts:', filteredPosts);
      setPosts(filteredPosts);
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
    setLoading(false);
  };

  const fetchUsers = async () => {
    try {
      const res = await API.get('/Users/all');
      setUsers(res.data);
    } catch (err) {}
  };

  const filteredPosts = category === 'All' ? posts : posts.filter(p => p.category === category);

  const handleFollow = (userId) => {
    if (!following.includes(userId)) {
      setFollowing([...following, userId]);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-tabs">
        <button className={activeTab === 'feed' ? 'active' : ''} onClick={() => setActiveTab('feed')}>Dream Feed</button>
        <button className={activeTab === 'post' ? 'active' : ''} onClick={() => setActiveTab('post')}>Post Dream</button>
      </div>
      <div className="profile-card wide-card" style={{width:'100%',maxWidth:'1000px'}}>
        {activeTab === 'feed' && (
          <>
            <h3 style={{textAlign:'center',marginBottom:'1.2em'}}>Dream Feed</h3>
            <div style={{display:'flex',justifyContent:'center',marginBottom:'1.5em'}}>
              <div className="category-filter">
                <label>Filter by Category: </label>
                <select value={category} onChange={e => setCategory(e.target.value)}>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            {loading ? <p>Loading...</p> : (
              <div className="posts-list-grid">
                {filteredPosts.map(post => (
                  <Post key={post.id} post={post} currentUser={user} onUpdate={fetchPosts} />
                ))}
              </div>
            )}
          </>
        )}
        {activeTab === 'post' && (
          <>
            <h3 style={{textAlign:'center',marginBottom:'1.2em'}}>Post a Dream</h3>
            <PostForm onPost={fetchPosts} />
          </>
        )}
      </div>
    </div>
  );
} 