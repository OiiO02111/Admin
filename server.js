const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');
const sequelize = require('./config/db');
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded ({ extended: true }));


app.post('/user', (req, res) => {
    console.log('req.body:', req.body);  // Check if body is parsed correctly
    if (!req.body || !req.body.name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    // Process the request
  });


app.use('/api', authRoutes);

 sequelize.authenticate()
  .then(() => {
    console.log('Database connected successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

   sequelize.sync();


  const PORT = process.env.PORT || 4000;
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

// Synchronize Sequelize models and start the server
