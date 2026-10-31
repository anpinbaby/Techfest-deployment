import { useState, useEffect } from 'react';
import './App.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [formData, setFormData] = useState({ name: '', email: '', college: '', event: 'Web Hackathon' });
  const [registrations, setRegistrations] = useState([]);
  const [message, setMessage] = useState('');

  const fetchRegistrations = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/registrations`);
      if (res.ok) {
        const data = await res.json();
        setRegistrations(data);
      }
    } catch (err) {
      console.error("Failed to fetch registrations:", err);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Submitting...');
    try {
      const res = await fetch(`${API_BASE_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Registration Successful!');
        setFormData({ name: '', email: '', college: '', event: 'Web Hackathon' });
        fetchRegistrations();
      } else {
        setMessage(data.message || 'Registration failed');
      }
    } catch (err) {
      setMessage('Error connecting to backend server');
    }
  };

  return (
    <div className="container">
      <header>
        <h1>🚀 Tech-Fest 2026 Portal</h1>
        <p>Register for events & compete with the best!</p>
      </header>

      <main className="main-content">
        <section className="form-section">
          <h2>Event Registration</h2>
          {message && <div className="alert">{message}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Anpin Baby" />
            </div>
            <div className="form-group">
              <label>College Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="anpin@mbcet.ac.in" />
            </div>
            <div className="form-group">
              <label>College Name</label>
              <input type="text" name="college" value={formData.college} onChange={handleChange} required placeholder="MBCET" />
            </div>
            <div className="form-group">
              <label>Select Event</label>
              <select name="event" value={formData.event} onChange={handleChange}>
                <option value="Web Hackathon">Web Hackathon</option>
                <option value="AI Code Rush">AI Code Rush</option>
                <option value="UI/UX Design Blitz">UI/UX Design Blitz</option>
                <option value="Robo Wars">Robo Wars</option>
              </select>
            </div>
            <button type="submit" className="btn">Register Now</button>
          </form>
        </section>

        <section className="list-section">
          <h2>Registered Participants ({registrations.length})</h2>
          {registrations.length === 0 ? (
            <p>No registrations yet. Be the first!</p>
          ) : (
            <ul className="participant-list">
              {registrations.map((reg) => (
                <li key={reg._id} className="card">
                  <h3>{reg.name}</h3>
                  <p><strong>Event:</strong> {reg.event}</p>
                  <p><strong>College:</strong> {reg.college}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;