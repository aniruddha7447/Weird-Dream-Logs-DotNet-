import { useState, useEffect } from 'react';
import API from '../services/api';
import Post from './Post';
import '../styles/Profile.css';
import scaryImg from '../assets/scary.jpg';
import funnyImg from '../assets/funny.jpg';
import adventureImg from '../assets/adventure.jpg';
import fantasyImg from '../assets/fantasy.jpg';
import otherImg from '../assets/other.jpg';
import { useAuth } from '../contexts/AuthContext';

const CATEGORIES = [
  'All',
  'Scary',
  'Funny',
  'Adventure',
  'Fantasy',
  'Other'
];
const CATEGORY_IMAGES = {
  Scary: scaryImg,
  Funny: funnyImg,
  Adventure: adventureImg,
  Fantasy: fantasyImg,
  Other: otherImg
};

export default function Profile({ user, onUpdate }) {
  const { updateUser } = useAuth();
  const [bio, setBio] = useState(user?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [myDreams, setMyDreams] = useState([]);
  const [myComments, setMyComments] = useState([]);
  const [category, setCategory] = useState('All');
  const [activeTab, setActiveTab] = useState('info');
  const [visibility, setVisibility] = useState('All');
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [oldPassword, setOldPassword] = useState('');

  useEffect(() => {
    fetchMyDreams();
    fetchMyComments();
  }, [user]);

  const fetchMyDreams = async () => {
    try {
      const res = await API.get(`/Dreams/mine/${user.id}`);
      setMyDreams(res.data);
    } catch (err) {
      console.error('Error fetching my dreams:', err);
    }
  };

  const fetchMyComments = async () => {
    try {
      const res = await API.get(`/Comments/user/${user.id}`);
      setMyComments(res.data);
      console.log('Fetched my comments:', res.data);
    } catch (err) {
      console.error('Error fetching my comments:', err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    try {
      const res = await API.put('/Users', { bio, avatarUrl });
      setSuccess(true);
      if (res.data) updateUser(res.data);
      onUpdate && onUpdate();
    } catch (err) {
      setError('Failed to update profile.');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);
    try {
      await API.put('/Users/password', { userId: user.id, oldPassword, newPassword });
      setPasswordSuccess(true);
      setNewPassword('');
      setOldPassword('');
    } catch (err) {
      setPasswordError('Failed to change password.');
    }
  };

  const filteredDreams = myDreams.filter(d =>
    (category === 'All' || d.category === category) &&
    (visibility === 'All' || (visibility === 'Public' ? d.isPublic : !d.isPublic))
  );

  return (
    <div className="profile-container">
      <div className="profile-tabs">
        <button className={activeTab === 'info' ? 'active' : ''} onClick={() => setActiveTab('info')}>Profile Info</button>
        <button className={activeTab === 'dreams' ? 'active' : ''} onClick={() => setActiveTab('dreams')}>My Dreams</button>
        <button className={activeTab === 'comments' ? 'active' : ''} onClick={() => setActiveTab('comments')}>My Comments</button>
        <button className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>Settings</button>
      </div>
      {activeTab === 'info' && (
        <div className="profile-card">
          <h2>My Profile</h2>
          <form onSubmit={handleSave} className="profile-form">
            <input
              type="text"
              placeholder="Avatar URL"
              value={avatarUrl}
              onChange={e => setAvatarUrl(e.target.value)}
            />
            <textarea
              placeholder="Bio"
              value={bio}
              onChange={e => setBio(e.target.value)}
            />
            <button type="submit">Save</button>
            {success && <div className="success">Profile updated!</div>}
            {error && <div className="error">{error}</div>}
          </form>
          {avatarUrl && <img src={avatarUrl} alt="avatar" className="profile-avatar" />}
        </div>
      )}
      {activeTab === 'dreams' && (
        <div className="profile-card" style={{width:'100%',maxWidth:'1000px'}}>
          <h3 style={{textAlign:'center',marginBottom:'1.2em'}}>My Dreams</h3>
          <div style={{display:'flex',gap:'2em',justifyContent:'center',marginBottom:'1.5em',flexWrap:'wrap'}}>
            <div className="category-filter">
              <label>Filter by Visibility: </label>
              <select value={visibility} onChange={e => setVisibility(e.target.value)}>
                <option value="All">All</option>
                <option value="Public">Public</option>
                <option value="Private">Private</option>
              </select>
            </div>
            <div className="category-filter">
              <label>Filter by Category: </label>
              <select value={category} onChange={e => setCategory(e.target.value)}>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="posts-list-grid">
            {filteredDreams.map(post => (
              <Post key={post.id} post={post} currentUser={user} onUpdate={fetchMyDreams} />
            ))}
          </div>
        </div>
      )}
      {activeTab === 'comments' && (
        <div className="profile-card">
          <h3>My Comments</h3>
          <div style={{background:'#fff',borderRadius:'14px',padding:'2em 1.5em',minHeight:'80px',boxShadow:'0 2px 16px rgba(60,72,88,0.08)'}}>
            {myComments.length === 0 ? (
              <div style={{color:'#888',fontStyle:'italic'}}>You haven't commented on any dreams yet.</div>
            ) : (
              <ul style={{listStyle:'none',padding:0,margin:0}}>
                {myComments.map(c => (
                  <li key={c.id} style={{background:'#f9fafb',color:'#222',marginBottom:'1.2em',padding:'1.2em 1em',borderRadius:'10px',boxShadow:'0 2px 8px rgba(60,72,88,0.06)',display:'flex',flexDirection:'column',alignItems:'flex-start'}}>
                    <div style={{fontWeight:600,marginBottom:'0.3em',wordBreak:'break-word'}}>{c.content}</div>
                    <div style={{fontSize:'0.97em',color:'#888',marginTop:'0.2em'}}>on <b>{c.dreamTitle}</b> &middot; {new Date(c.createdAt).toLocaleString()}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
      {activeTab === 'settings' && (
        <div className="profile-card">
          <h3>Settings</h3>
          <div className="profile-info-box">
            <div><span className="profile-info-label">Username:</span> <span className="profile-info-value">{user.username}</span></div>
            <div><span className="profile-info-label">Email:</span> <span className="profile-info-value">{user.email}</span></div>
          </div>
          <form onSubmit={handleChangePassword} className="profile-form">
            <label>Change Password:</label>
            <div className="input-icon-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Old Password"
                value={oldPassword}
                onChange={e => setOldPassword(e.target.value)}
                required
              />
              <span className="show-hide-icon" onClick={() => setShowPassword(v => !v)}>
                {showPassword ? '🙈' : '👁️'}
              </span>
            </div>
            <div className="input-icon-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="New Password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
              />
              <span className="show-hide-icon" onClick={() => setShowPassword(v => !v)}>
                {showPassword ? '🙈' : '👁️'}
              </span>
            </div>
            <button type="submit">Change Password</button>
            {passwordSuccess && <div className="success">Password changed!</div>}
            {passwordError && <div className="error">{passwordError}</div>}
          </form>
        </div>
      )}
    </div>
  );
} 