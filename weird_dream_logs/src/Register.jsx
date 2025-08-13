import { useState } from 'react';
import { Link } from 'react-router-dom';
import './styles/Register.css';

export default function Register({ onRegister }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    try {
      const res = await fetch('https://localhost:7051/api/Auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Registration failed');
      }
      setSuccess(true);
      onRegister && onRegister();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <Link to="/" className="back-home">← Back to Home</Link>
          <h2>Join WeirdDreamLogs</h2>
          <p>Create your account and start sharing your dreams</p>
        </div>
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <button type="submit" className="register-btn">Create Account</button>
          {error && <div className="error">{error}</div>}
          {success && <div className="success">Registration successful! Please login.</div>}
        </form>
        <div className="register-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="link-btn">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
} 