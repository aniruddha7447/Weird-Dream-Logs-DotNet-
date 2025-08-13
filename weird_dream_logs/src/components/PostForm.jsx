import { useState } from 'react';
import API from '../services/api';
import '../styles/PostForm.css';

const CATEGORIES = [
  'Scary',
  'Funny',
  'Adventure',
  'Fantasy',
  'Other'
];

export default function PostForm({ onPost }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [error, setError] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [confirmation, setConfirmation] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await API.post('/Dreams', { title, content, category, isPublic });
      setTitle('');
      setContent('');
      setCategory(CATEGORIES[0]);
      setIsPublic(true);
      onPost && onPost();
      setConfirmation('Dream posted!');
      setTimeout(() => setConfirmation(''), 2000);
    } catch (err) {
      setError('Failed to post.');
    }
  };

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      {confirmation && <div style={{color:'#4caf50',marginBottom:'0.7em',fontWeight:600}}>{confirmation}</div>}
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <select value={category} onChange={e => setCategory(e.target.value)} required>
        {CATEGORIES.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
      <textarea
        placeholder="Describe your dream..."
        value={content}
        onChange={e => setContent(e.target.value)}
        required
      />
      <label style={{display:'flex',alignItems:'center',gap:'0.5em',margin:'0.7em 0'}}>
        <input
          type="checkbox"
          checked={isPublic}
          onChange={e => setIsPublic(e.target.checked)}
        />
        Make it Public
      </label>
      <button type="submit">Post Dream</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
} 