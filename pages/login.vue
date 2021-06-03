<template>
  <div class="login-page">
    <h1>Login Page</h1>
    <login-form></login-form>
  </div>
</template>

<script>
import LoginForm from "~/components/Forms/LoginForm.vue";
export default {
  components: { LoginForm },
  layout: "empty",
};
</script>

<style>
</style>