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
        <span>My City Isn't listed</span>
      </v-tooltip>
    </template>

    <v-card>
      <v-card-title class="headline">
        Can't find your City
        {{ $vuetify.breakpoint.mdAndUp ? "or LGA?" : "?" }}
        <v-spacer></v-spacer
        ><v-btn text icon @click="dialog = false"
          ><v-icon>mdi-close</v-icon></v-btn
        >
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="pt-2 pb-0">
        <p class="mb-2">
          {{
            $vuetify.breakpoint.mdAndUp
              ? "If you can't find your City or LGA (Local Government Area) on the list, p"
              : "P"
          }}lease fill the form below, and we'll have it added (within 12
          hours).
        </p>
        <p class="mb-2">
          In the meantime, please select the nearest city available (You can
          always update this later).
        </p>
      </v-card-text>
      <v-card-text>
        <h3 class="font-weight-light">Add my City / LGA</h3>
        <v-divider class="mb-n1"></v-divider>
        <CityRequestForm
          :selectedCountryCode="selectedCountryCode"
          :selectedStateCode="selectedStateCode"
          @cityRequestSent="cityRequestSent"
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
import CityRequestForm from "../Forms/data/CityRequestForm.vue";
export default {
  components: { CityRequestForm },
  props: ["selectedCountryCode", "selectedStateCode"],
  data() {
    return {
      dialog: false,
    };
  },
  methods: {
    cityRequestSent(e) {
      console.log({ e });
      this.$emit("cityRequestSent", { e });
      setTimeout(() => {
        this.dialog = false;
      }, 1500);
    },
  },
};
</script>

<style>
</style>