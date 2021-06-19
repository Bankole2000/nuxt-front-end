<template>
  <div class="listing-spaces">
    <v-container>
      <ApolloMutation
        :mutation="require('@/graphql/listings/updateListingGeodata.gql')"
        :variables="{
          listingUUID: listingUUID,
          updateData: listingData,
        }"
        class="form"
        @done="next"
      >
        <template slot-scope="{ mutate }">
          <form v-on:submit.prevent="formIsValid && mutate()">
            <v-row>
              <v-col cols="12" sm="6" class="display-4">
                <v-checkbox
                  v-model="listingData.allowedSpaces"
                  label="Laundry"
                  hide-details
                  value="Laundry"
                ></v-checkbox>
              </v-col>
              <v-col cols="12" sm="6" class="display-4">
                <v-checkbox
                  v-model="listingData.allowedSpaces"
                  label="Hot Tub"
                  hide-details
                  value="Hot Tub"
                ></v-checkbox>
              </v-col>
              <v-col cols="12" sm="6" class="display-4">
                <v-checkbox
                  v-model="listingData.allowedSpaces"
                  label="Kitchen"
                  hide-details
                  value="Kitchen"
                ></v-checkbox>
              </v-col>
              <v-col cols="12" sm="6" class="display-4">
                <v-checkbox
                  v-model="listingData.allowedSpaces"
                  label="Yard"
                  hide-details
                  value="Yard"
                ></v-checkbox>
              </v-col>
              <v-col cols="12" sm="6" class="display-4">
                <v-checkbox
                  v-model="listingData.allowedSpaces"
                  label="Swimming Pool"
                  hide-details
                  value="Swimming Pool"
                ></v-checkbox>
              </v-col>
              <v-col cols="12" sm="6" class="display-4">
                <v-checkbox
                  v-model="listingData.allowedSpaces"
                  label="Elevator"
                  hide-details
                  value="Elevator"
                ></v-checkbox>
              </v-col>
              <v-col cols="12" sm="6" class="display-4">
                <v-checkbox
                  v-model="listingData.allowedSpaces"
                  label="Parking Space"
                  hide-details
                  value="Parking Space"
                ></v-checkbox>
              </v-col>
              <v-col cols="12" sm="6" class="display-4">
                <v-checkbox
                  v-model="listingData.allowedSpaces"
                  label="Gym"
                  hide-details
                  value="Gym"
                ></v-checkbox>
              </v-col>
              <v-col cols="12" class="display-4">
                <v-btn
                  :disabled="!formIsValid"
                  type="submit"
                  block
                  x-large
                  color="primary"
                  class="mt-4"
                  ><span class="title">Next</span>
                  <v-icon right>mdi-arrow-right-circle</v-icon></v-btn
                >
              </v-col>
            </v-row>
          </form>
        </template>
      </ApolloMutation>
    </v-container>
  </div>
</template>

<script>
export default {
  props: ["listingUUID"],
  data() {
    return {
      listingData: {
        allowedSpaces: [],
      },
    };
  },
  computed: {
    formIsValid() {
      return true;
    },
  },
  methods: {
    next(e) {
      console.log({ e });
      this.$emit("next", { listingData: this.listingData });
    },
  },
};
</script>

<style>
</style>