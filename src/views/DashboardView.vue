<template>
  <div>
    <AdminNavbar></AdminNavbar>
    <div class="container py-5">
      <router-view :check-admin="checkLogin"></router-view>
    </div>

  </div>
</template>
<script>
import AdminNavbar from '@/components/backstage/BackNavbar.vue'

const { VITE_URL } = import.meta.env

export default {
  components: { AdminNavbar },
  methods: {
    checkLogin () {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
        '$1'
      )
      this.$http.defaults.headers.common.Authorization = token
      this.$http.post(`${VITE_URL}/v2/api/user/check`)
        .then((res) => {
          console.log(res)
          if (!res.data.success) {
            this.$router.push('/login')
          }
        })
        .catch((err) => {
          alert(err.response.data.message)
          this.$router.push('/login')
        })
    }

  },
  mounted () {
    this.checkLogin()
  }
}
</script>
