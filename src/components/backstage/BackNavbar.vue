<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
          <div class="navbar-nav d-flex">
            <router-link to="/admin/orders" class="nav-link text-light ps-4">訂單列表</router-link>
            <router-link to="/admin/products" class="nav-link text-light ps-4">商品列表</router-link>
          </div>
          <div>
            <button type="button" href="#" @click.prevent="logout" class="btn btn-danger ms-auto">登出</button>
          </div>

        </div>

  </nav>
</template>

<script>
export default {
  data () {
    return {}
  },
  methods: {
    logout () {
      document.cookie = 'hexToken=; expires=; path=/'
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
</style>
