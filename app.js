const express = require('express');
const authRoutes = require('./routes/authRoutes');
const urlRoutes = require('./routes/urlRoutes');
require('dotenv').config();

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/url', urlRoutes);

module.exports = app;