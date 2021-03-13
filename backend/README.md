# Read2Be Backend

The backend of the book tracking platform.

Software requirements:
- nodejs
- npm
- mongodb

## Running

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

There are 4 main entities in the system, <ins>User</ins>, <ins>Book</ins>, <ins>Publisher</ins> and <ins>Author</ins> and three documents that provide value mapping to strings such as <ins>Language</ins>, <ins>Status</ins> and <ins>Genre</ins>

### User
```json
{
    "user_id":       "string",
    "username":      "string",
    "nickname":      "string",
    "password_hash": "string",
    "email":         "string",
    "role":          "string",
    "avatar_url":    "string",
    "books": [
        {
            "isbn":            "string",
            "status":          "int",
            "rate":            "int",
            "date_registered": "string"
        }
    ],
    "friends":["user_id:string"],
    "pending":["user_id:string"]
```

### Book
```json
{
    "isbn":      "string",
    "name":      "string",
    "authors":   ["name:string"],
    "publisher": "string",
    "genre":     "int",
    "language":  "int",
    "rate": {
        "num_rates":    "int",
        "current_rate": "float"
    },
    "reviews": [
        {
            "user_id": "string",
            "message": "string",
            "date":    "date",
        }
    ]
}
```

### Publisher
```json
{
    "name": "string",
    "books": "string"
}
```

### Author
```json
{
    "name": "string",
    "books": "string"
}
```

## Endpoints

<!-- Documentation for endpoints will be provided as a Swagger UI -->

### Users
```
[x] [User]  GET /users
[x] [User]  GET /users/:username
    [Admin] POST /users
[x] [User]  PATCH /users/:username
[x] [User]  DELETE /users/:username

    [User]  GET /users/:username/avatar

[x] [User]  POST /users/:username/books
[x] [User]  DELETE /users/:username/books/:isbn
[x] [User]  PATCH /users/:username/books/:isbn
    [User]  PATCH /users/:username/requests/:friend_username
```

### Books
```
[x] [User]  GET /books
    [User]  GET /books/:isbn
    [Admin] POST /books
    [User]  GET /books/:isbn/cover
```

### Publishers
```
    [User]  GET /publishers
    [User]  GET /publishers/:publisher_id
    [Admin] POST /publishers
```

### Authors
```
    [User]  GET /authors
    [User]  GET /authors/:author_id
    [Admin] POST /authors
```


> **Note:**
> 
> All listing results must be paginated, endpoints like:
> - GET /users
>
> Pagination arguments can be provided in query parameters:
> - GET /user?page_num=0&page_limit=20

