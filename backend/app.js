const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// ======================
// ROUTING HALAMAN DULU
// ======================

// ROOT → LOGIN
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// USER
app.get('/user', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ADMIN
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// HISTORY
app.get('/history', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'history.html'));
});

// ======================
// BARU STATIC FILE
// ======================
app.use(express.static(path.join(__dirname, 'public')));

// ======================
// API ROUTES
// ======================
const motionRoutes = require('./routes/motion.routes');
const authRoutes = require('./routes/auth.routes');

app.use('/api/motion', motionRoutes);
app.use('/api/auth', authRoutes);

// ======================
app.listen(3000, () => {
  console.log('🚀 Server running on http://localhost:3000');
});
