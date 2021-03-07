const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

require('dotenv/config');

const app = express();

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Read2Be API",
      version: '0.0.1',
    },
  },
  apis: ["app.js","routes/index.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));


const index_router = require('./routes/index');

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://127.0.0.1/read2be';
mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', () => console.error("MongoDB connection error..."));
db.once('open', () => console.log("Connected to MongoDB successfully..."));



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', index_router);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
    // Set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.json({ "error": err.message });
});

module.exports = app;
