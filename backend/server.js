const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes (will be imported later)
app.use('/api/users', require('./routes/users'));
app.use('/api/workouts', require('./routes/workouts'));
app.use('/api/nutrition', require('./routes/nutrition'));

// Default route
app.get('/', (req, res) => {
  res.send('DRD Fitness API is running');
});

// Port configuration
const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/drd-fitness')
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    console.log('MongoDB Connected');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err.message);
  });