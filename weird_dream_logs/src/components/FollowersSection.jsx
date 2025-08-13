import { useState, useEffect } from 'react';
import { FaUserPlus, FaUserMinus, FaBan, FaUnlock } from 'react-icons/fa';
import API from '../services/api';
import '../styles/FollowersSection.css';
import '../styles/Profile.css';

export default function FollowersSection({ user }) {
  const [activeTab, setActiveTab] = useState('search');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [following, setFollowing] = useState([]); // user ids
  const [blocked, setBlocked] = useState([]); // user ids
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [followers, setFollowers] = useState([]);
  const [followingUsers, setFollowingUsers] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [confirmation, setConfirmation] = useState('');

  useEffect(() => {
    fetchFollowing();
    fetchBlocked();
    fetchPending();
    fetchFollowers();
    fetchFollowingUsers();
    fetchBlockedUsers();
    // eslint-disable-next-line
  }, []);

  const fetchFollowing = async () => {
    try {
      const res = await API.get(`/Followers/following/${user.id}`);
      setFollowing(res.data.map(u => u.id));
    } catch {}
  };
  const fetchBlocked = async () => {
    try {
      const res = await API.get(`/Followers/followers/${user.id}`);
      // Blocked users are not directly returned, so this is a placeholder for future block list endpoint
      setBlocked([]);
    } catch {}
  };
  const fetchPending = async () => {
    try {
      const res = await API.get(`/Followers/pending/${user.id}`);
      setPending(res.data);
    } catch {}
  };
  const fetchFollowers = async () => {
    try {
      const res = await API.get(`/Followers/followers/${user.id}`);
      setFollowers(res.data);
    } catch {}
  };
  const fetchFollowingUsers = async () => {
    try {
      const res = await API.get(`/Followers/following/${user.id}`);
      setFollowingUsers(res.data);
    } catch {}
  };
  const fetchBlockedUsers = async () => {
    try {
      const res = await API.get(`/Followers/blocked/${user.id}`);
      console.log('Blocked users response:', res.data);
      setBlockedUsers(res.data);
    } catch (err) {
      console.error('Error fetching blocked users:', err);
      setBlockedUsers([]);
    }
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await API.get(`/Users/all`);
      // Exclude self and admin
      const filtered = res.data.filter(u => u.id !== user.id && u.role !== 'Admin');
      setResults(filtered.filter(u =>
        u.username.toLowerCase().includes(query.toLowerCase()) ||
        u.email.toLowerCase().includes(query.toLowerCase())
      ));
    } catch (err) {
      setResults([]);
      setError('Failed to search users.');
    }
    setLoading(false);
  };

  const handleFollow = async (u) => {
    setError('');
    try {
      await API.post('/Followers/request', { requesterId: user.id, targetId: u.id });
      fetchFollowing();
      setConfirmation('Follow request sent!');
      setTimeout(() => setConfirmation(''), 2000);
    } catch (err) {
      if (err.response?.data === 'Cannot follow: this user has blocked you.') {
        setError('This user has blocked you.');
      } else {
        setError('Failed to send follow request.');
      }
    }
  };
  const handleUnfollow = async (u) => {
    setError('');
    try {
      await API.post('/Followers/unfollow', { followerId: user.id, followedId: u.id });
      fetchFollowing();
      fetchFollowingUsers();
      fetchFollowers();
      fetchBlockedUsers();
      setConfirmation('Unfollowed user.');
      setTimeout(() => setConfirmation(''), 2000);
    } catch (err) {
      setError('Failed to unfollow.');
    }
  };
  const handleBlock = async (u) => {
    setError('');
    try {
      await API.post('/Followers/block', { followerId: user.id, followedId: u.id });
      // Refresh all relevant lists
      await Promise.all([
        fetchBlocked(),
        fetchFollowing(),
        fetchFollowingUsers(),
        fetchFollowers(),
        fetchBlockedUsers()
      ]);
      setConfirmation('User blocked.');
      setTimeout(() => setConfirmation(''), 2000);
    } catch (err) {
      setError('Failed to block user.');
    }
  };
  const handleUnblock = async (u) => {
    setError('');
    try {
      await API.post('/Followers/unblock', { followerId: user.id, followedId: u.id });
      // Refresh all relevant lists
      await Promise.all([
        fetchBlocked(),
        fetchFollowing(),
        fetchFollowingUsers(),
        fetchFollowers(),
        fetchBlockedUsers()
      ]);
      setConfirmation('User unblocked.');
      setTimeout(() => setConfirmation(''), 2000);
    } catch (err) {
      setError('Failed to unblock user.');
    }
  };
  const handleAccept = async (requestId) => {
    setError('');
    try {
      await API.post('/Followers/accept', { requestId });
      fetchPending();
      fetchFollowing();
    } catch (err) {
      setError('Failed to accept request.');
    }
  };
  const handleReject = async (requestId) => {
    setError('');
    try {
      await API.post('/Followers/reject', { requestId });
      fetchPending();
    } catch (err) {
      setError('Failed to reject request.');
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-tabs">
        <button className={activeTab === 'search' ? 'active' : ''} onClick={() => setActiveTab('search')}>User Search</button>
        <button className={activeTab === 'pending' ? 'active' : ''} onClick={() => setActiveTab('pending')}>Pending Requests</button>
        <button className={activeTab === 'followers' ? 'active' : ''} onClick={() => setActiveTab('followers')}>Followers</button>
        <button className={activeTab === 'blocked' ? 'active' : ''} onClick={() => setActiveTab('blocked')}>Blocked Users</button>
      </div>
      <div className="profile-card" style={{width:'100%',maxWidth:'900px'}}>
        <h2 style={{textAlign:'center',marginBottom:'1.2em'}}>Followers Section</h2>
        <div className="followers-tab-content">
          {confirmation && <div style={{color:'#4caf50',marginBottom:'0.7em',fontWeight:600}}>{confirmation}</div>}
          {activeTab === 'search' && (
            <div style={{width:'100%'}}>
              <form onSubmit={handleSearch} style={{display:'flex',gap:'0.5em',marginBottom:'1em'}}>
                <input
                  type="text"
                  placeholder="Search users by username or email..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  style={{flex:1,padding:'0.6em',borderRadius:4,border:'none'}}
                />
                <button type="submit" style={{background:'#646cff',color:'#fff',border:'none',borderRadius:4,padding:'0.6em 1.2em',cursor:'pointer'}}>Search</button>
              </form>
              {error && <div style={{color:'#ff6b6b',marginBottom:'0.5em'}}>{error}</div>}
              <div className="user-list-grid">
                {loading && <div style={{color:'#aaa'}}>Loading...</div>}
                {!loading && results.length === 0 && <div style={{color:'#aaa'}}>No users found.</div>}
                {results.map(u => (
                  <div key={u.id} className="user-card">
                    <div className="user-card-header">
                      <img src={u.avatarUrl || 'https://ui-avatars.com/api/?name='+u.username} alt="avatar" className="user-card-avatar" />
                      <div>
                        <div className="user-card-username">{u.username}</div>
                        <div className="user-card-email">{u.email}</div>
                      </div>
                    </div>
                    <div className="user-card-bio">{u.bio || <span style={{color:'#888'}}>No bio</span>}</div>
                    <div className="user-card-actions">
                      {blocked.includes(u.id) ? (
                        <button className="unblock-btn" onClick={() => handleUnblock(u)} title="Unblock">
                          <FaUnlock style={{marginRight:'0.3em'}} /> Unblock
                        </button>
                      ) : following.includes(u.id) ? (
                        <>
                          <button className="unfollow-btn" onClick={() => handleUnfollow(u)} title="Unfollow">
                            <FaUserMinus style={{marginRight:'0.3em'}} /> Unfollow
                          </button>
                          <button className="block-btn" onClick={() => handleBlock(u)} title="Block">
                            <FaBan style={{marginRight:'0.3em'}} /> Block
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="follow-btn" onClick={() => handleFollow(u)} title="Follow">
                            <FaUserPlus style={{marginRight:'0.3em'}} /> Follow
                          </button>
                          <button className="block-btn" onClick={() => handleBlock(u)} title="Block">
                            <FaBan style={{marginRight:'0.3em'}} /> Block
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'pending' && (
            <div style={{width:'100%'}}>
              <h3 style={{textAlign:'center'}}>Pending Follow Requests</h3>
              {error && <div style={{color:'#ff6b6b',marginBottom:'0.5em'}}>{error}</div>}
              {pending.length === 0 && <div className="empty-message">No pending requests.</div>}
              <div style={{maxWidth:'1200px',margin:'0 auto',width:'100%'}}>
                <div className="user-list-grid">
                  {pending.map(req => (
                    <div key={req.id} className="user-card" style={{marginBottom:'1em'}}>
                      <div className="user-card-header">
                        <img src={req.requester.avatarUrl || 'https://ui-avatars.com/api/?name='+req.requester.username} alt="avatar" className="user-card-avatar" />
                        <div>
                          <div className="user-card-username">{req.requester.username}</div>
                          <div className="user-card-email">{req.requester.email}</div>
                        </div>
                      </div>
                      <div className="user-card-bio">{req.requester.bio || <span style={{color:'#888'}}>No bio</span>}</div>
                      <div className="user-card-actions">
                        <button className="accept-btn" onClick={() => handleAccept(req.id)} style={{marginRight:'0.5em',background:'#4caf50',color:'#fff',border:'none',borderRadius:4,padding:'0.4em 1em',cursor:'pointer'}}>Accept</button>
                        <button className="reject-btn" onClick={() => handleReject(req.id)} style={{background:'#ff6b6b',color:'#fff',border:'none',borderRadius:4,padding:'0.4em 1em',cursor:'pointer'}}>Reject</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {activeTab === 'followers' && (
            <div style={{width:'100%'}}>
              <h3 style={{textAlign:'center'}}>Followers</h3>
              {error && <div style={{color:'#ff6b6b',marginBottom:'0.5em'}}>{error}</div>}
              <div style={{marginBottom:'1.5em'}}>
                <b style={{display:'block',textAlign:'center'}}>People you follow:</b>
                {followingUsers.length === 0 && <div style={{color:'#aaa'}}>You are not following anyone.</div>}
                <div className="user-list-grid">
                  {followingUsers.map(u => (
                    <div key={u.id} className="user-card" style={{marginBottom:'1em'}}>
                      <div className="user-card-header">
                        <img src={u.avatarUrl || 'https://ui-avatars.com/api/?name='+u.username} alt="avatar" className="user-card-avatar" />
                        <div>
                          <div className="user-card-username">{u.username}</div>
                          <div className="user-card-email">{u.email}</div>
                        </div>
                      </div>
                      <div className="user-card-bio">{u.bio || <span style={{color:'#888'}}>No bio</span>}</div>
                      <div className="user-card-actions">
                        <button className="unfollow-btn" onClick={() => handleUnfollow(u)} title="Unfollow">
                          <FaUserMinus style={{marginRight:'0.3em'}} /> Unfollow
                        </button>
                        <button className="block-btn" onClick={() => handleBlock(u)} title="Block">
                          <FaBan style={{marginRight:'0.3em'}} /> Block
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <b style={{display:'block',textAlign:'center'}}>Your followers:</b>
                {followers.length === 0 && <div style={{color:'#aaa'}}>No one is following you yet.</div>}
                <div className="user-list-grid">
                  {followers.map(u => (
                    <div key={u.id} className="user-card" style={{marginBottom:'1em'}}>
                      <div className="user-card-header">
                        <img src={u.avatarUrl || 'https://ui-avatars.com/api/?name='+u.username} alt="avatar" className="user-card-avatar" />
                        <div>
                          <div className="user-card-username">{u.username}</div>
                          <div className="user-card-email">{u.email}</div>
                        </div>
                      </div>
                      <div className="user-card-bio">{u.bio || <span style={{color:'#888'}}>No bio</span>}</div>
                      <div className="user-card-actions">
                        <button className="block-btn" onClick={() => handleBlock(u)} title="Block">
                          <FaBan style={{marginRight:'0.3em'}} /> Block
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {activeTab === 'blocked' && (
            <div style={{width:'100%'}}>
              <h3 style={{textAlign:'center'}}>Blocked Users</h3>
              {blockedUsers.length === 0 && <div style={{color:'#aaa'}}>No blocked users.</div>}
              <div className="user-list-grid">
                {blockedUsers.map(u => (
                  <div key={u.id} className="user-card" style={{marginBottom:'1em'}}>
                    <div className="user-card-header">
                      <img src={u.avatarUrl || 'https://ui-avatars.com/api/?name='+u.username} alt="avatar" className="user-card-avatar" />
                      <div>
                        <div className="user-card-username">{u.username}</div>
                        <div className="user-card-email">{u.email}</div>
                      </div>
                    </div>
                    <div className="user-card-bio">{u.bio || <span style={{color:'#888'}}>No bio</span>}</div>
                    <div className="user-card-actions">
                      <button className="unblock-btn" onClick={() => handleUnblock(u)} title="Unblock">
                        <FaUnlock style={{marginRight:'0.3em'}} /> Unblock
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 