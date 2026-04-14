const express = require('express');
const morgan = require('morgan');
const logger = require('./utils/logger');
const authRoutes = require('./routes/authRoutes');
const urlRoutes = require('./routes/urlRoutes');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use("/", urlRoutes);  
// Log all requests using Morgan and Winston

app.use(
    morgan('combined', {
        stream: {
            write: (message) => logger.info(message.trim()),
        },
    })
)

app.use('/api/auth', authRoutes);
app.use('/api/url', urlRoutes);

module.exports = app;