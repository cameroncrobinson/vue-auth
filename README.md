# vue-auth

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
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
npm run serve
```

Restart the Vue development server after changing `vue.config.js`. Open the Vue URL shown in terminal 2 and navigate to `#/register`.

The form posts to `/api/register`; the development proxy forwards it to `http://127.0.0.1:3000`. A successful request returns 201, invalid fields return 400, and an existing email returns 409. Passwords must contain 8–128 characters.

User records persist in `server/data/users.json` (ignored by Git). Passwords are stored as salted scrypt hashes, and neither passwords nor hashes are returned to the browser. This file storage is intended for local development with a single API process. Login and sessions are not implemented yet. For deployment, use a database and configure your hosting server to forward `/api` to the backend; the Vue development proxy is not included in a production build.

Run backend integration checks with: npm run test:server

