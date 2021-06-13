<template>
  <div class="contacts-list">
    <v-navigation-drawer
      :value="showContacts"
      right
      fixed
      app
      :min-width="$vuetify.breakpoint.mdAndUp ? 'auto' : '100vw'"
      :style="{ minWidth: $vuetify.breakpoint.mdAndUp ? 'auto' : '100vw' }"
      style="display: flex; flex-direction: column"
    >
      <v-toolbar class="contacts-toolbar">
        <v-btn
          icon
          @click.stop="$emit('hideContactsList')"
          v-if="$vuetify.breakpoint.smAndDown"
        >
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-scroll-y-transition leave-absolute>
          <v-toolbar-title class="ml-2" v-show="!searching"
            >Contacts</v-toolbar-title
          >
        </v-scroll-y-transition>
        <v-scroll-y-reverse-transition>
          <v-text-field
            dense
            v-model="searchText"
            v-show="searching"
            placeholder="username"
            label="Search Contacts"
            hide-details
          ></v-text-field>
        </v-scroll-y-reverse-transition>

        <v-btn icon class="ml-auto">
          <v-slide-x-reverse-transition mode="out-in">
            <!-- TODO: Find a way to fix this issue here -->
            <v-icon
              :key="`icon-${searching}`"
              :color="searching ? 'error' : 'primary'"
              @click="searching = !searching"
              v-text="searching ? 'mdi-close' : 'mdi-magnify'"
            ></v-icon>
          </v-slide-x-reverse-transition>
        </v-btn>
      </v-toolbar>
      <div style="flex: 1; margin-top: 64px">
        <Contacts />
        <Contacts />
        <Contacts />
      </div>
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light> mdi-repeat </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import Contacts from "./Contacts.vue";
export default {
  props: ["showContacts"],
  components: {
    Contacts,
  },
  data() {
    return {
      searching: false,
      searchText: "",
    };
  },
};
</script>

<style>
.contacts-toolbar {
  position: fixed;
  background-color: white;
  width: 100%;

  z-index: 1;
  box-shadow: 0 0.46875rem 2.1875rem rgba(4, 9, 20, 0.03),
    0 0.9375rem 1.40625rem rgba(4, 9, 20, 0.03),
    0 0.25rem 0.53125rem rgba(4, 9, 20, 0.05),
    0 0.125rem 0.1875rem rgba(4, 9, 20, 0.03) !important;
}
</style>