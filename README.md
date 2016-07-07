### Todo list

A simple mobile todo list set up with a server, and logins.

See it live at: https://marklyck.github.io/Todo-List/

![alt text](https://github.com/MarkLyck/Todo-List/blob/master/dist/assets/images/screenshot.png?raw=true "Screenshot")

as part of our assignment, we were required to do a very quick mockup. Here's what the 1-day project started out as:

![alt text](https://github.com/MarkLyck/Todo-List/blob/master/dist/assets/images/mockup.png?raw=true "Screenshot")

We were also tasked to do some data modeling before we started coded, which I've included below.

#data model

The endpoints will be user id's
each user will have a username, and an array of todo's
each todo will have a title, description, and a binary state (completed or not completed)

- Collection of users
  - user
  - id
    - username
    - Todolist
      - title
      - description
      - state

Making user accounts was outside the scope of the project, but I wanted to make the application a little more useful. So each todo list is connected to your login.

It is by no means secure, as it only requires a string that's not empty. But the functionality is there to expand on.
