const express = require('express');
const cors = require('cors');
const menuRoutes = require('./routes/menuRoutes');
const typeRoutes = require('./routes/typeRoutes');
const authen = require('./routes/authen');
const ratingRoutes = require('./routes/ratingRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes Mounting
app.use('/api/menu', menuRoutes);
app.use('/api/type', typeRoutes);
app.use('/api/authen', authen);
app.use('/api/rating', ratingRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.send('API is running...');
});

module.exports = app;
