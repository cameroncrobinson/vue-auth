<template>
<form @submit.prevent="handleRegisterUser">
  <div class="mb-3">
    <label for="username" class="form-label">Username</label>
    <input type="text" class="form-control" id="username" v-model="username" placeholder="Enter username" required>
  </div>
  <div class="mb-3">
    <label for="email" class="form-label">Email address</label>
    <input type="email" class="form-control" id="email" v-model="email" placeholder="Enter email" required>
  </div>
  <div class="mb-3">
    <label for="password" class="form-label">Password</label>
    <input type="password" class="form-control" id="password" v-model="password" placeholder="Password" minlength="8" maxlength="128" required>
  </div>
  <p v-if="message" role="status" :class="hasError ? 'text-danger' : 'text-success'">{{ message }}</p>
  <button type="submit" class="btn btn-primary" :disabled="submitting">{{ submitting ? 'Registering...' : 'Register' }}</button>
</form>
</template>

<script>
import axios from 'axios'
export default {
  name: 'RegisterUser',
  data() {
    return {
      username: '',
      email: '',
      password: '',
      message: '',
      hasError: false,
      submitting: false
    }
  },
  methods: {
    async handleRegisterUser() {
      if (this.submitting) return
      this.submitting = true
      this.message = ''
      this.hasError = false
      try {
        const response = await axios.post('/api/register', {
          username: this.username,
          email: this.email,
          password: this.password
        })
        this.message = response.data.message
        this.password = ''
      } catch (error) {
        this.hasError = true
        this.message = error.response?.data?.message || 'Unable to reach the registration server. Make sure the backend is running.'
      } finally {
        this.submitting = false
      }
    }
  },
  props: {
    msg: String
  }
}
</script>

