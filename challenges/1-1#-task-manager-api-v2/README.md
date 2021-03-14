# Task Manager API V2
  
## Overview 

This is an API to handle basic user registration and the creation of tasks.
The user, once registred, will be able to create, list, update as done and delete tasks.
It's called "v2" because I've done one similar project [here](https://github.com/regisfaria/task-manager-api).

What v2 differs from v1:
- users now have a kind of "plan".
  - free is able to store until 10 todos
  - pro have unlimited todos
- better middlewares in code

The reason for another repository to be created instead of updating the old one was that I'm using a template, since this is a challenge from Rocketseat course.

I have created a file called: **insomnia-routes.json** so you can use as route example for insomnia.

## Instalation & Running  
I'm using **nodejs** and **yarn**, but you can run with **npm** as well
just run:
```shell
yarn
```
or:
```shell
npm install
```

then to run the server
```shell
yarn dev
```

server will be listening on port 3333, make sure it is available or change it on src/server.js.


