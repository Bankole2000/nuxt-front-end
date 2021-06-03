<template>
  <div>
    <h1>This page is for product PID: {{ $route.params.pid }}</h1>
  </div>
</template>

<script>
export default {
  beforeMount() {
    console.log(this.$route);
  },
};
</script>

<style>
</style>