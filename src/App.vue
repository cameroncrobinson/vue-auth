<template>
  <div id="app">
    <NavBar />
    <component :is="currentView" />
  </div>
</template>

<script>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import NavBar from './components/NavBar'
import HomePage from './components/HomePage'
import LoginPage from './components/Pages/LoginPage'
import RegisterUser from './components/Pages/RegisterUser'

const routes = {
  '/': HomePage,
  '/Login': LoginPage,
  '/register': RegisterUser
}

export default {
  name: 'App',
  components: { NavBar },
  setup() {
    const currentPath = ref(window.location.hash)
    const updatePath = () => {
      currentPath.value = window.location.hash
    }
    const currentView = computed(() => {
      return routes[currentPath.value.slice(1) || '/'] || HomePage
    })

    onMounted(() => window.addEventListener('hashchange', updatePath))
    onUnmounted(() => window.removeEventListener('hashchange', updatePath))

    return { currentView }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
