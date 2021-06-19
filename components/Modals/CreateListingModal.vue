<template>
  <div class="create-listing-modal">
    <v-dialog
      v-model="dialog"
      fullscreen
      scrollable
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on">
          <v-icon>mdi-home-group</v-icon> Create A Listing
        </v-btn>
      </template>
      <v-card tile>
        <v-card-title class="pa-0">
          <v-toolbar elevation="0" style="border-bottom: 1px solid lightgrey">
            <v-btn icon @click="dialog = false">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <v-toolbar-title
              >App Name |
              <span class="font-weight-light"
                >Create a Listing</span
              ></v-toolbar-title
            >
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn
                class="px-6 font-weight-light"
                text
                @click="dialog = false"
              >
                <v-icon left>mdi-content-save-all</v-icon> Save And Exit</v-btn
              >
              <v-btn
                class="px-6 font-weight-light"
                text
                @click="dialog = false"
              >
                <v-icon left>mdi-window-close</v-icon> Cancel</v-btn
              >
            </v-toolbar-items>
          </v-toolbar>
        </v-card-title>
        <v-card-text style="padding: 0; margin: 0; display: flex">
          <div
            style="
              height: 100%;
              width: 100%;
              flex: 4;

              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
            "
          >
            <v-container fluid>
              <v-row>
                <v-col
                  :cols="$vuetify.breakpoint.smAndDown ? '12' : '10'"
                  :offset="$vuetify.breakpoint.smAndDown ? '0' : '1'"
                >
                  <Listing-form />
                </v-col>
              </v-row>
            </v-container>
          </div>
          <div
            style="background-color: red; height: 100%; width: 100%; flex: 3"
            v-if="$vuetify.breakpoint.mdAndUp"
          ></div>
        </v-card-text>

        <v-divider></v-divider>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import ListingForm from "../Forms/ListingForm.vue";
export default {
  components: { ListingForm },
  data() {
    return {
      dialog: false,
      notifications: false,
      sound: true,
      widgets: false,
    };
  },
};
</script>

<style>
</style>