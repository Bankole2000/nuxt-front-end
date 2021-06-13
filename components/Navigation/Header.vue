<template>
  <v-app-bar
    :clipped-left="clipped"
    :color="$vuetify.theme.dark ? '#272727' : '#fafbfc'"
    class="header"
    height="64px"
    app
  >
    <!-- elevate-on-scroll -->
    <v-app-bar-nav-icon @click.stop="$emit('toggleDrawer')" />
    <v-btn
      icon
      @click.stop="$emit('toggleMiniVariant')"
      v-if="$vuetify.breakpoint.mdAndUp"
    >
      <v-icon>mdi-{{ `chevron-${miniVariant ? "right" : "left"}` }}</v-icon>
    </v-btn>
    <!-- <v-btn icon @click.stop="$emit('toggleClipped')">
      <v-icon>mdi-application</v-icon>
    </v-btn>
    <v-btn icon @click.stop="$emit('toggleFixed')">
      <v-icon>mdi-minus</v-icon>
    </v-btn> -->
    <v-toolbar-title v-text="title" />
    <v-spacer v-if="$vuetify.breakpoint.mdAndUp"></v-spacer>

    <v-switch
      class="mr-2"
      v-model="$vuetify.theme.dark"
      hide-details
    ></v-switch>
    <MenuModal />
    <v-divider
      vertical
      class="ml-4 mr-2"
      v-if="$vuetify.breakpoint.mdAndUp"
    ></v-divider>
    <v-list color="transparent">
      <v-list-item
        v-if="$vuetify.breakpoint.mdAndUp"
        class="px-2"
        style="height: 64px; width: 280px"
      >
        <v-list-item-avatar>
          <v-img src="https://randomuser.me/api/portraits/women/75.jpg"></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>@username</v-list-item-title>
          <v-list-item-subtitle>techybanky@gmail.com</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-badge
            :content="3"
            class="ml-n2"
            :value="3"
            color="green"
            overlap
            offset-x="20"
            offset-y="20"
          >
            <v-btn icon>
              <v-icon>mdi-bell-outline</v-icon>
            </v-btn>
          </v-badge>
        </v-list-item-action>
      </v-list-item>
    </v-list>
    <v-btn icon @click.stop="$emit('toggleRightDrawer')">
      <v-icon>mdi-contacts</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
import MenuModal from "../Modals/MenuModal.vue";
export default {
  components: { MenuModal },
  props: ["clipped", "miniVariant"],
  data() {
    return {
      drawer: false,
      fixed: false,
      rightDrawer: false,
      title: "App Name",
    };
  },
};
</script>

<style>
.header {
  box-shadow: 0 0.46875rem 2.1875rem rgba(4, 9, 20, 0.03),
    0 0.9375rem 1.40625rem rgba(4, 9, 20, 0.03),
    0 0.25rem 0.53125rem rgba(4, 9, 20, 0.05),
    0 0.125rem 0.1875rem rgba(4, 9, 20, 0.03) !important;
}
</style>