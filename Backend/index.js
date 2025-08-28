// Backend/index.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log('MongoDB connection error:', err));

// Import routes
const userRoutes = require('./routes/users');
const workshopRoutes = require('./routes/workshops');

// Use routes
app.use('/api/users', userRoutes);
app.use('/api', workshopRoutes); // Routes protected by JWT middleware in workshops.js

// Test root route
app.get('/', (req, res) => {
  res.send('Backend server is running');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
