const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const swagger_js_doc = require("swagger-jsdoc");
const swagger_ui = require("swagger-ui-express");

require('dotenv/config');

const app = express();

const swagger_options = {
    swaggerDefinition: {
        info: {
            title: "Read2Be API",
            version: '0.0.1'
        },
        host:`localhost:${process.env.PORT || "8080"}`,
        basePath:"/api",
        tags: [
            {
                name: "Authentication"
            }
        ],
        securityDefinitions: {
            "bearerAuth": {
                "type": "apiKey",
                "name": "Authorization",
                "in": "header"
            }
        }
    },
    apis: ["routes/*.js"],
};

const swagger_docs = swagger_js_doc(swagger_options);
app.use('/docs', swagger_ui.serve, swagger_ui.setup(swagger_docs));


const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://127.0.0.1/read2be';
mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', () => console.error("MongoDB connection error..."));
db.once('open', () => console.log("Connected to MongoDB successfully..."));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use('/public',express.static(path.join(__dirname, 'public')));
app.use('/storage/books',express.static(path.join(__dirname, 'storage/books')));
app.use('/storage/users',express.static(path.join(__dirname, 'storage/users')));

const authentication_router = require('./routes/authentication');
const users_router = require('./routes/users');
const books_router = require('./routes/books');
const authors_router = require('./routes/authors');
const publishers_router = require('./routes/publishers');
const genres_router = require('./routes/genres');
app.use('/api', authentication_router);
app.use('/api', users_router);
app.use('/api', books_router);
app.use('/api', authors_router);
app.use('/api', publishers_router);
app.use('/api', genres_router);

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
