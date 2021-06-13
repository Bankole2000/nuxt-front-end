<template>
  <v-app dark>
    <AppHeader
      :clipped="clipped"
      :miniVariant="miniVariant"
      @toggleFixed="fixed = !fixed"
      @toggleDrawer="drawer = !drawer"
      @toggleMiniVariant="miniVariant = !miniVariant"
      @toggleClipped="clipped = !clipped"
      @toggleRightDrawer="rightDrawer = !rightDrawer"
    />
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list-item class="px-2" style="height: 64px">
        <v-list-item-avatar>
          <v-img src="https://randomuser.me/api/portraits/women/75.jpg"></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>@username</v-list-item-title>
          <v-list-item-subtitle>techybanky@gmail.com</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>
      <v-list>
        <v-list-item-group
          :color="$vuetify.theme.dark ? 'secondary' : 'primary'"
        >
          <v-list-item
            v-for="(item, i) in items"
            :key="i"
            :to="item.to"
            router
            exact
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="item.title" />
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-main
      :style="{ backgroundColor: $vuetify.theme.dark ? '#121212' : '#f1f4f6' }"
    >
      <!-- <v-container> -->
      <transition name="router-anim">
        <nuxt />
      </transition>
      <!-- </v-container> -->
    </v-main>
    <ContactsList
      @hideContactsList="rightDrawer = false"
      :showContacts="rightDrawer"
    />
    <v-footer inset app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
    <Snackbar />
  </v-app>
</template>

<script>
import AppHeader from "../components/Navigation/Header.vue";
import Snackbar from "@/components/shared/Snackbar.vue";
import ContactsList from "~/components/User/ContactsList.vue";
export default {
  components: {
    AppHeader,
    Snackbar,
    ContactsList,
  },
  data() {
    return {
      clipped: false,
      drawer: true,
      fixed: false,
      items: [
        {
          icon: "mdi-apps",
          title: "Welcome",
          to: "/",
        },
        {
          icon: "mdi-chart-bubble",
          title: "Inspire",
          to: "/inspire",
        },
        {
          icon: "mdi-package-down",
          title: "Products",
          to: "/products",
        },
        {
          icon: "mdi-test-tube",
          title: "Test Page",
          to: "/test",
        },
        {
          icon: "mdi-login-variant",
          title: "Login",
          to: "/login",
        },
      ],
      miniVariant: false,

      rightDrawer: false,
      title: "Vuetify.js",
    };
  },
};
</script>
<style>
.router-anim-enter-active {
  animation: coming 0.5s;
  animation-delay: 0.3s;
  opacity: 0;
}

.router-anim-leave-active {
  animation: going 0.3s;
}

@keyframes going {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50px);
    opacity: 0;
  }
}

@keyframes coming {
  from {
    transform: translateX(-50px);
    opacity: 0;
  }
  to {
    transform: translateX(0px);
    opacity: 1;
  }
}
</style>
