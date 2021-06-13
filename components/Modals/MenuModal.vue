<template>
  <v-dialog scrollable v-model="dialog" fullscreen>
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="primary lighten-2" dark v-bind="attrs" v-on="on" icon>
        <v-icon>mdi-apps</v-icon>
      </v-btn>
    </template>

    <v-card
      :style="{
        backgroundColor: $vuetify.theme.dark
          ? '#121212CC'
          : 'rgba(255, 255, 255, 0.9)',
      }"
    >
      <v-card-title
        ><v-spacer></v-spacer
        ><v-btn icon @click="dialog = false"
          ><v-icon>mdi-window-close</v-icon></v-btn
        ></v-card-title
      >
      <v-card-text
        style="
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
        "
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
    };
  },
};
</script>

<style>
</style>