# vue-auth

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run dev
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Registration backend

Use Node.js 18 or newer. Install dependencies with `npm install`, then open two terminals in this project:

```sh
# Terminal 1: Express API on port 3000
npm run server
```

```sh
# Terminal 2: Vue development server
npm run dev
```

Restart the Vue development server after changing `vite.config.js`. Open the Vue URL shown in terminal 2 and navigate to `#/register`.

The form posts to `/api/register`; the development proxy forwards it to `http://127.0.0.1:3000`. A successful request returns 201, invalid fields return 400, and an existing email returns 409. Passwords must contain 8�128 characters.

User records persist in `server/data/users.json` (ignored by Git). Passwords are stored as salted scrypt hashes, and neither passwords nor hashes are returned to the browser. This file storage is intended for local development with a single API process. Login and logout use an HttpOnly session cookie. Sessions are kept in memory and expire after one hour; restarting the API signs users out. For deployment, use a database and configure your hosting server to forward `/api` to the backend; the Vue development proxy is not included in a production build.


## Login flow

After registering, open `#/Login` and use the same email and password. The form sends `POST /api/login`. The server finds the user by email, hashes the submitted password with that user's saved salt, and compares the hash. On success it creates a session and returns only the user's id, username, and email. The browser stores the session cookie automatically; there is no token to put in localStorage.

`GET /api/me` checks the cookie and returns the signed-in user (or 401). The login page calls this when opened, so refreshing preserves login. `POST /api/logout` destroys the session. The login page includes a logout button. Future private API routes must check the session on the server just as `/api/me` does.

This session configuration is for local development. Before deploying, configure a persistent session store, a stable `SESSION_SECRET`, HTTPS with secure cookies, and login rate limiting. The default in-memory session store is not intended for production: https://expressjs.com/en/resources/middleware/session.html
