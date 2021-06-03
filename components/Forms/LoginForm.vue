<template>
  <div class="login-form">
    <v-form @submit.prevent="onSubmit">
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-text-field
              :loading="$apollo.loading"
              type="text"
              v-model="email"
              label="Email or @Username"
              placeholder="Email or @username"
              outlined
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-text-field
              label="Password"
              v-model="password"
              type="password"
              outlined
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>
      <v-btn type="submit">Submit</v-btn>
      <v-btn :loading="$apollo.loadingMe" @click="viewLoggedInUser"
        >View User</v-btn
      >
      <v-btn @click="viewListings">View Listings</v-btn>
      <v-btn @click="onLogout">Logout</v-btn>
      <v-btn @click="testVuexApollo">Vuex Apollo</v-btn>
      <nuxt-link to="/">Home</nuxt-link>
      <div>
        {{ listings }}
      </div>
      <div>{{ me }}{{ count }}</div>
    </v-form>
  </div>
</template>

<script>
import gql from "graphql-tag";
import { mapActions } from "vuex";
export default {
  // apollo: {
  //   me: gql`
  //     query {
  //       me {
  //         username
  //         email
  //       }
  //     }
  //   `,
  // },
  data() {
    return {
      email: "",
      username: "",
      password: "",
      me: "",
      count: 0,
      listings: [],
    };
  },
  methods: {
    ...mapActions("user", ["setPosts"]),
    testVuexApollo() {
      console.log(this.$store);
      this.setPosts();
    },
    onSubmit() {
      console.log("Submitted");
      this.$store.dispatch("user/onLogin", {
        email: this.email,
        password: this.password,
      });
    },
    async viewLoggedInUser() {
      const result = await this.$apollo.query({
        query: gql`
          query {
            me {
              username
              email
            }
          }
        `,
        fetchPolicy: `no-cache`,
        loadingKey: "loadingMe",
      });
      const {
        data: { me },
      } = result;
      console.log({ me });
      this.me = me;
      this.count++;
      console.log(this.$apollo);
    },
    async onLogout() {
      this.$store.dispatch("user/onLogout");
    },
    async viewListings() {
      try {
        const result = await this.$apollo.query({
          query: gql`
            query {
              listings {
                title
              }
            }
          `,
          fetchPolicy: `no-cache`,
        });
        console.log({ result });
        const {
          data: { listings },
        } = result;
        this.listings = listings;
      } catch (err) {
        this.listings = [];
        console.log({ err });
      }
    },
  },
};
</script>

<style>
</style>