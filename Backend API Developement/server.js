const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    status: 'UP',
    service: 'DevOps Backend API',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Backend API running on port ${PORT}`);
});
