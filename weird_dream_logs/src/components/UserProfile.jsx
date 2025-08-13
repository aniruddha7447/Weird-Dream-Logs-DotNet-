import { useState, useEffect } from 'react';
import API from '../services/api';
import Post from './Post';
import '../styles/UserProfile.css';

export default function UserProfile({ userId, currentUser }) {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
    fetchPosts();
    // eslint-disable-next-line
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const res = await API.get(`/Users/${userId}`);
      setProfile(res.data);
    } catch (err) {}
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await API.get('/Dreams');
      setPosts(res.data.filter(p => p.userId === userId));
    } catch (err) {}
    setLoading(false);
  };

  if (!profile) return <div>Loading profile...</div>;

  return (
    <div className="user-profile-container">
      <h2>{profile.username}'s Profile</h2>
      {profile.avatarUrl && <img src={profile.avatarUrl} alt="avatar" className="profile-avatar" />}
      <p><b>Email:</b> {profile.email}</p>
      <p><b>Bio:</b> {profile.bio}</p>
      <h3>Dreams</h3>
      {loading ? <p>Loading...</p> : (
        <div className="posts-list">
          {posts.map(post => (
            <Post key={post.id} post={post} currentUser={currentUser} onUpdate={fetchPosts} />
          ))}
        </div>
      )}
    </div>
  );
} 