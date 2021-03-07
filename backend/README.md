# Read2Be Backend

The backend of the app, made with nodejs, expressjs and mongodb

```sh
# Install all needed packages
npm install
# Start server
npm start
```

___

# Guide

This document will help in some hints on the project and some decisions that were made in development. This will also describe some endpoints and useful info about database and api server.

## Database Model

## Endpoints

<!-- Documentation for endpoints will be provided as a Swagger UI -->

### Users
```
GET /users
GET /users/:user_id
POST /users
PATCH /users/:user_id

POST /users/:user_id/books
PATCH /users/:user_id/requests/:index
```

### Books
```
GET /books
GET /books/:isbn
```

### Publishers
```
GET /publishers
GET /publishers/:publisher_id
```

### Authors
```
GET /authors
GET /authors/:author_id
```


> **Notes:**
> 
> All listing results must be paginated, endpoints like:
> - GET /users