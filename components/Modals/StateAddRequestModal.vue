<template>
  <v-dialog
    :fullscreen="$vuetify.breakpoint.smAndDown"
    v-model="dialog"
    width="500"
  >
    <template v-slot:activator="{ on: menu, attrs }">
      <v-tooltip top>
        <template v-slot:activator="{ on: tooltip }">
          <v-btn
            color="primary"
            dark
            v-bind="attrs"
            v-on="{ ...menu, ...tooltip }"
          >
            <v-icon>mdi-help-circle</v-icon>
          </v-btn>
        </template>
        <span>My State Isn't listed</span>
      </v-tooltip>
    </template>

    <v-card>
      <v-card-title class="headline">
        Can't find your State
        {{ $vuetify.breakpoint.mdAndUp ? "or Province?" : "?" }}
        <v-spacer></v-spacer
        ><v-btn text icon @click="dialog = false"
          ><v-icon>mdi-close</v-icon></v-btn
        >
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="pt-2 pb-0">
        <p>
          {{
            $vuetify.breakpoint.mdAndUp
              ? "If you can't find your state or province on the list, p"
              : "P"
          }}lease fill the form below, and we'll have it added (within 12
          hours).
        </p>
        <p>
          In the meantime, please select the nearest state available (You can
          always update this later).
        </p>
      </v-card-text>
      <v-card-text>
        <h3 class="font-weight-light">Add my state / province</h3>
        <v-divider class="mb-n1"></v-divider>
        <StateRequestForm
          :selectedCountryCode="selectedCountryCode"
          @stateRequestSent="stateRequestSent"
        />
      </v-card-text>

      <v-divider></v-divider>

      <!-- <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="dialog = false"> I accept </v-btn>
      </v-card-actions> -->
    </v-card>
  </v-dialog>
</template>

<script>
import StateRequestForm from "../Forms/data/StateRequestForm.vue";
export default {
  components: { StateRequestForm },
  props: ["selectedCountryCode"],
  data() {
    return {
      dialog: false,
    };
  },
  methods: {
    stateRequestSent(e) {
      console.log({ e });
      this.$emit("stateRequestSent", { e });
      setTimeout(() => {
        this.dialog = false;
      }, 1500);
    },
  },
};
</script>

<style>
</style>