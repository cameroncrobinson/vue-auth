<template>
  <div class="container mt-5">
    <h2>Login</h2>
    <p v-if="message" role="status" :class="hasError ? 'text-danger' : 'text-success'">{{ message }}</p>
    <div v-if="user">
      <p>Signed in as {{ user.username }} ({{ user.email }}).</p>
      <button class="btn btn-secondary" :disabled="submitting" @click="handleLogout">Logout</button>
    </div>
    <form v-else @submit.prevent="handleLogin">
      <div class="mb-3">
        <label for="email" class="form-label">Email address</label>
        <input type="email" class="form-control" id="email" v-model="email" autocomplete="username" placeholder="Enter email" required>
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input type="password" class="form-control" id="password" v-model="password" autocomplete="current-password" placeholder="Password" required>
      </div>
      <button type="submit" class="btn btn-primary" :disabled="submitting">{{ submitting ? 'Signing in...' : 'Login' }}</button>
    </form>
    <a href="#" @click.prevent="handleForgotPassword">Forgot password?</a>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'LoginPage',
  data() {
    return { email: '', password: '', user: null, message: '', hasError: false, submitting: false }
  },
  async mounted() {
    try {
      // The browser sends the session cookie automatically through the /api proxy.
      const response = await axios.get('/api/me')
      this.user = response.data.user
    } catch (error) {
      if (error.response?.status !== 401) {
        this.hasError = true
        this.message = 'Unable to check your session. Make sure the backend is running.'
      }
    }
  },
  methods: {
    async handleLogin() {
      if (this.submitting) return
      this.submitting = true
      this.message = ''
      this.hasError = false
      try {
        const response = await axios.post('/api/login', { email: this.email, password: this.password })
        this.user = response.data.user
        this.message = response.data.message
        this.password = ''
      } catch (error) {
        this.hasError = true
        this.message = error.response?.data?.message || 'Unable to reach the login server. Make sure the backend is running.'
      } finally {
        this.submitting = false
      }
    },
    async handleLogout() {
      if (this.submitting) return
      this.submitting = true
      this.hasError = false
      try {
        const response = await axios.post('/api/logout')
        this.user = null
        this.message = response.data.message
      } catch (error) {
        this.hasError = true
        this.message = 'Unable to log out. Please try again.'
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>
