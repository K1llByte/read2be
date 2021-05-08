# Read2be

Read2be is a web-app that allows users to register read books
history data and serves as a social network for this purpose.

This project is divided in 3 sub-projects: the **backend**,
the **frontend** and the **recomender**.

In each project can be found a Readme with <ins>usefull information</ins> about each server and <ins>how to operate</ins> with it.

- [Backend README](/backend/README.md)
- [Frontend README](/frontend/README.md)
- [Recommender README](/recommender/README.md)


## Planning

|                |                     |
|:--------------:|:-------------------:|
| Base WebApp    | May 20th            |
| 2nd Checkpoint | May 31th - June 5th |


### Goals
> <ins>**Base WebApp**</ins>
> 
> The Base WebApp stage will satisfy the main system's objectives and provide basic functionality to users, but it isn't considered complete since any extra enhacements > will not be considered and the priority will always be the initial feature proposal.
> 
> - BackEnd
>     - [x] Authentication
>     - [x] Manage User data
>     - [x] Manage User book data
>     - [x] Manage User defined book collections
>     - [x] Manage User friends
>     - [ ] Book library search engine
>     - [ ] Upgrade server configurability
>     - [ ] Populate system's database 
>     - [ ] Branding
>     - [ ] Make deployable build
>
> - FrontEnd
>     - [ ] UI: Authors/Publisher (Optional)
>     - [ ] UI: User with list
>     - [ ] UI: Book library with search
>     - [ ] UI: Login
>     - [ ] UI: Register
>     - [ ] Port non administrive backend funcionalities to webapp
>
> - Recommender
>     - [ ] Collaborative Filtering based on user's classification on books

> <ins>**Upgrade 1**</ins>
> 
> - BackEnd
>     - [ ] Automaticly build server (Docker Image)
> 
> - FrontEnd
>     - [ ] Automaticly build server (Docker Image)
>     
> - Recommender
>     - [ ] Automaticly build server (Docker Image)
>     - [ ] Testing automation with github CI


<!--
## Backend

A REST API in JSON format to implement the system logic and control the app flow.

## Frontend

A HTTP server that serves dynamic views with data from the backend.

## Recomender

A REST API in JSON format for the Recomender Engine to answer to recomendations of books to users.
-->