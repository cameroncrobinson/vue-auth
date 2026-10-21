<template>
    <form v-else @submit.prevent="handlePasswordReset">
      <div class="mb-3">
        <label for="password" class="form-label">ResetPassword</label>
        <input type="password" class="form-control" id="password" v-model="password" autocomplete="current-password" placeholder="Password" required>
      </div>
      <button type="submit" class="btn btn-primary" :disabled="submitting">{{ submitting ? 'Resetting...' : 'Reset Password' }}</button>
    </form>
</template>
<script>
export default {
  name: 'PassReset',
  data() {
    return {
      email: '',
      message: '',
      hasError: false,
      submitting: false
    }
  },
  methods: {
    async handlePasswordReset() {
      if (this.submitting) return
      this.submitting = true
      this.message = '
      this.hasError = false
      try {
        const response = await axios.post('/api/password-reset', { email: this.email })
        this.message = response.data.message
      } catch (error) {
        this.hasError = true
        this.message = error.response?.data?.message || 'Unable to reach the password reset server. Make sure the backend is running.'
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>
