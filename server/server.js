const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Registration = require('./models/Registration');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/techfest2026';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// Test Route
app.get('/', (req, res) => {
  res.send('Tech-Fest 2026 Backend API is running!');
});

// Register Event API
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, college, event } = req.body;
    if (!name || !email || !college || !event) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const newRegistration = new Registration({ name, email, college, event });
    await newRegistration.save();
    res.status(201).json({ message: 'Registration Successful!', data: newRegistration });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Get Registrations API
app.get('/api/registrations', async (req, res) => {
  try {
    const registrations = await Registration.find().sort({ registeredAt: -1 });
    res.status(200).json(registrations);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});