import { Link } from 'react-router-dom';
import '../styles/Home.css';

export default function Home() {
  return (
    <div className="home-container">
      {/* Navigation */}
      <nav className="navbar" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'2em',flexDirection:'row'}}>
        <div className="navbar-logo">
          WeirdDreamLogs
        </div>
        <div style={{display:'flex',gap:'1em',alignItems:'center',justifyContent:'center'}}>
          <a href="#about" className="navbar-link">About Us</a>
          <a href="#contact" className="navbar-link">Contact Us</a>
          <Link to="/login" className="navbar-link" style={{background:'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',color:'#fff',fontWeight:600}}>Login</Link>
          <Link to="/register" className="navbar-link" style={{background:'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',color:'#fff',fontWeight:600}}>Register</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Share Your Weirdest Dreams</h1>
          <p className="hero-subtitle">
            Connect with dreamers worldwide. Share, discover, and discuss the most bizarre, 
            fascinating, and unforgettable dreams. Your imagination has no limits here.
          </p>
          <div className="hero-buttons">
            <Link to="/login" className="cta-button primary">Get Started</Link>
            <a href="#features" className="cta-button secondary">Learn More</a>
          </div>
        </div>
        <div className="hero-image">
          <div className="dream-illustration">
            <div className="floating-elements">
              <div className="element element-1">🌙</div>
              <div className="element element-2">✨</div>
              <div className="element element-3">💭</div>
              <div className="element element-4">🌟</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <h2 className="section-title">Why Choose WeirdDreamLogs?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Privacy Control</h3>
            <p>Choose to keep your dreams private or share them with the community. You're in control.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Connect & Follow</h3>
            <p>Follow other dreamers, discover new perspectives, and build meaningful connections.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>Engage & Discuss</h3>
            <p>Like, comment, and engage with dreams that resonate with you. Start conversations.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏷️</div>
            <h3>Organize Dreams</h3>
            <p>Categorize your dreams by type - scary, funny, adventure, fantasy, or other.</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="about-content">
          <h2 className="section-title">About WeirdDreamLogs</h2>
          <p className="about-text">
            WeirdDreamLogs is a unique social platform dedicated to dream sharing and exploration. 
            We believe that dreams are windows into our subconscious minds, revealing our deepest 
            thoughts, fears, and desires. By sharing and discussing dreams, we can gain insights 
            into ourselves and connect with others on a deeper level.
          </p>
          <p className="about-text">
            Our platform provides a safe, supportive environment where dreamers can freely express 
            their nocturnal adventures without judgment. Whether you're a vivid dreamer or just 
            curious about the dream world, you're welcome here.
          </p>
        </div>
        {/* Our Team Section */}
        <div className="our-team-section">
          <h2 className="section-title">Our Team</h2>
          <div className="team-cards">
            <div className="team-card">
              <img src="/images/utsav.jpg" alt="Utsav Gavli" className="team-avatar" />
              <h3>Utsav Gavli</h3>
              <div className="team-role">Full Stack Developer</div>
              <p className="team-desc">A passionate full-stack developer with expertise in building modern web applications. This project demonstrates skills in both frontend and backend development.</p>
              <a href="#" className="github-btn" target="_blank" rel="noopener noreferrer"><i className="fa fa-github"></i> GitHub Profile</a>
            </div>
            <div className="team-card">
              <img src="/images/shriraj.jpg" alt="Shweta Sherkar" className="team-avatar" />
              <h3>Shweta Sherkar</h3>
              <div className="team-role">Full Stack Developer</div>
              <p className="team-desc">A skilled developer with a strong background in web development and database management. Contributed to backend architecture and API development.</p>
              <a href="#" className="github-btn" target="_blank" rel="noopener noreferrer"><i className="fa fa-github"></i> GitHub Profile</a>
            </div>
            <div className="team-card">
              <img src="/images/nazmin.jpg" alt="Aniruddha Lalge" className="team-avatar" />
              <h3>Aniruddha Lalge</h3>
              <div className="team-role">Full Stack Developer</div>
              <p className="team-desc">Experienced in UI/UX design and frontend development. Played a key role in creating the user interface and ensuring a smooth user experience.</p>
              <a href="#" className="github-btn" target="_blank" rel="noopener noreferrer"><i className="fa fa-github"></i> GitHub Profile</a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <h2 className="section-title">Contact Us</h2>
        <div className="contact-content">
          <div className="contact-info">
            <h3>Get in Touch</h3>
            <p>Have questions, suggestions, or just want to say hello? We'd love to hear from you!</p>
            <div className="contact-details">
              <div className="contact-item">
                <span className="contact-icon">📧</span>
                <span>support@weirddreamlogs.com</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">🌐</span>
                <span>www.weirddreamlogs.com</span>
              </div>
            </div>
          </div>
          <div className="contact-form">
            <form>
              <input type="text" placeholder="Your Name" className="form-input" />
              <input type="email" placeholder="Your Email" className="form-input" />
              <textarea placeholder="Your Message" className="form-textarea" rows="4"></textarea>
              <button type="submit" className="submit-btn">Send Message</button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>WeirdDreamLogs</h4>
            <p>Share your dreams, connect with dreamers.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <a href="#features">Features</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="footer-section">
            <h4>Legal</h4>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 WeirdDreamLogs. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
} 