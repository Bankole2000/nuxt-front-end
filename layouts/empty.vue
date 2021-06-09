<template>
  <v-app>
    <nuxt />
    <Snackbar />
  </v-app>
</template>

<script>
import Snackbar from "~/components/shared/Snackbar.vue";
export default {
  components: { Snackbar },
};
</script>

<style>
</style>