<template>
  <!-- v-model="show" -->
  <v-snackbar
    :value="toast.show"
    :top="true"
    :right="$vuetify.breakpoint.mdAndUp"
    :centered="$vuetify.breakpoint.smAndDown"
    :timeout="toast.timeout"
  >
    {{ toast.message }}

    <template v-slot:action="{ attrs }">
      <v-btn
        dark
        text
        v-bind="attrs"
        :color="toast.sclass"
        @click="showToast({ show: false })"
      >
        <v-icon left>{{ toast.icon }}</v-icon> &nbsp; Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {};
  },

  computed: {
    ...mapGetters(["toast"]),
  },
  methods: {
    ...mapActions(["showToast"]),
  },
};
</script>

<style>
</style>