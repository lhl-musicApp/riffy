# vuejs-boilerplate

### WANT TO HELP?
I need a hand figuring out how to deploy this to a Digital Ocean server for demo purposes. Give me a shout!

#### A Vue.js Boilerplate Project
Includes
- Vue.js 2.0
- Express
- Passport
- Postgres

"dev": "gmail_pass=Manhattan1100 nodemon build/dev-server.js",
"build": "node build/build.js"


## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

## CHANGE LOG
### 0.5
- Switched to Postgres as database
- Removed Vue-Auth - will be building my own solution for it.
- Login + Register works, CRUD works for Todo List items.
### 0.3
- Refactored all code to Vue JS 2.0 (with updated vue-webpack template)
- Switched from Bulma CSS library to Bootstrap 4.0 Alpha (looks great now)
- Login no longer works but register + listing of users works perfectly.

### 0.2
- Vue-Auth working properly now, shows user data with $auth.user().email, etc.
- Register/Login/Logout works, needs more error checking though

### 0.1
- Vue-auth + Passport JS working together for Authentication
- RethinkDB connected and hosts the user accounts
- Bulma.io CSS library for UI

## TODO LIST
- Basic CRUD
- More advanced user system (roles + forgot password)
- Deploy to a demo server for people to try out + test
- Better error handling (almost none now)
