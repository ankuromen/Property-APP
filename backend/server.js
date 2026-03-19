require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

connectDB()
  .then(() => {
    app.get('/health', (req, res) => {
      res.json({ status: 'ok', message: 'Property API is running' });
    });

    app.use('/api/vendor', require('./routes/vendor'));
    app.use('/api/admin', require('./routes/admin'));
    app.use('/api/website', require('./routes/website'));

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
