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
[Done] [User]  GET /users
[Done] [User]  GET /users/:username
       [Admin] POST /users
[Done] [User]  PATCH /users/:username
[Done] [User]  DELETE /users/:username

[Done] [User]  POST /users/:username/books
[Done] [User]  DELETE /users/:username/books/:isbn
[Done] [User]  PATCH /users/:username/books/:isbn
       [User]  PATCH /users/:username/requests/:friend_username
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