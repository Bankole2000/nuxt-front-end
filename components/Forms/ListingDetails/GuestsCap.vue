<template>
  <div class="guest-capacity">
    <v-container>
      <v-row>
        <v-col cols="12">
          <ApolloMutation
            :mutation="require('@/graphql/listings/updateListingGuestCap.gql')"
            :variables="{
              listingUUID: listingUUID,
              updateData: listingData,
            }"
            class="form"
            @done="next"
          >
            <template slot-scope="{ mutate }">
              <form v-on:submit.prevent="formIsValid && mutate()">
                <v-row align="center">
                  <v-col cols="12" sm="8">
                    <h1 class="display-1 mb-0">How many Guests?</h1>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      class="display-1 font-weight-normal"
                      solo
                      v-model="listingData.guestCapacity"
                      label="Capacity"
                      type="number"
                      :min="1"
                      placeholder="1"
                      hide-details
                      append-icon="mdi-account"
                    >
                      <template v-slot:prepend>
                        <v-tooltip top>
                          <template v-slot:activator="{ on }">
                            <v-btn
                              :disabled="listingData.guestCapacity < 1"
                              icon
                              color="deep-orange lighten-1"
                              @click="listingData.guestCapacity--"
                            >
                              <v-icon x-large v-on="on">mdi-minus-thick</v-icon>
                            </v-btn>
                          </template>
                          <span>Subtract</span>
                        </v-tooltip>
                      </template>
                      <template v-slot:append-outer>
                        <v-tooltip top>
                          <template v-slot:activator="{ on }">
                            <v-btn
                              :disabled="listingData.guestCapacity >= 99"
                              icon
                              color="primary"
                              @click="listingData.guestCapacity++"
                            >
                              <v-icon x-large v-on="on">mdi-plus-thick</v-icon>
                            </v-btn>
                          </template>
                          <span>Add</span>
                        </v-tooltip>
                      </template>
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row align="center">
                  <v-col cols="12" sm="8">
                    <h1 class="display-1 mb-0">How many Bedrooms?</h1>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      class="display-1 font-weight-normal"
                      solo
                      v-model="listingData.noOfBedrooms"
                      label="Bedrooms"
                      type="number"
                      :min="0"
                      placeholder="1"
                      hide-details
                      append-icon="mdi-bed"
                    >
                      <template v-slot:prepend>
                        <v-tooltip top>
                          <template v-slot:activator="{ on }">
                            <v-btn
                              :disabled="listingData.noOfBedrooms < 1"
                              icon
                              color="deep-orange lighten-1"
                              @click="listingData.noOfBedrooms--"
                            >
                              <v-icon x-large v-on="on">mdi-minus-thick</v-icon>
                            </v-btn>
                          </template>
                          <span>Subtract</span>
                        </v-tooltip>
                      </template>
                      <template v-slot:append-outer>
                        <v-tooltip top>
                          <template v-slot:activator="{ on }">
                            <v-btn
                              :disabled="listingData.noOfBedrooms >= 99"
                              icon
                              @click="listingData.noOfBedrooms++"
                              color="primary"
                            >
                              <v-icon x-large v-on="on">mdi-plus-thick</v-icon>
                            </v-btn>
                          </template>
                          <span>Add</span>
                        </v-tooltip>
                      </template>
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row align="center">
                  <v-col cols="12" sm="8">
                    <h1 class="display-1 mb-0">How many Bathrooms?</h1>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      class="display-1 font-weight-normal"
                      solo
                      v-model="listingData.noOfBathrooms"
                      label="Bathrooms"
                      type="number"
                      :min="0"
                      placeholder="1"
                      hide-details
                      append-icon="mdi-shower"
                    >
                      <template v-slot:prepend>
                        <v-tooltip top>
                          <template v-slot:activator="{ on }">
                            <v-btn
                              :disabled="listingData.noOfBathrooms < 1"
                              icon
                              @click="listingData.noOfBathrooms--"
                              color="deep-orange lighten-1"
                            >
                              <v-icon x-large v-on="on">mdi-minus-thick</v-icon>
                            </v-btn>
                          </template>
                          <span>Subtract</span>
                        </v-tooltip>
                      </template>
                      <template v-slot:append-outer>
                        <v-tooltip top>
                          <template v-slot:activator="{ on }">
                            <v-btn
                              :disabled="listingData.noOfBathrooms >= 99"
                              icon
                              color="primary"
                              @click="listingData.noOfBathrooms++"
                            >
                              <v-icon x-large v-on="on">mdi-plus-thick</v-icon>
                            </v-btn>
                          </template>
                          <span>Add</span>
                        </v-tooltip>
                      </template>
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-btn
                  type="submit"
                  :disabled="!formIsValid"
                  block
                  color="primary"
                  class="mt-4"
                  x-large
                  ><span class="title">{{
                    formIsValid ? "Let's Go!" : "Ready?"
                  }}</span>
                  <v-icon right>mdi-arrow-right-circle</v-icon></v-btn
                >
              </form>
            </template>
          </ApolloMutation>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  props: ["listingUUID"],
  data() {
    return {
      listingData: {
        guestCapacity: 1,
        noOfBedrooms: 1,
        noOfBathrooms: 1,
      },
    };
  },
  computed: {
    formIsValid() {
      return this.listingData.guestCapacity > 0;
    },
  },
  methods: {
    next(e) {
      console.log({ e });
      console.log(this.listingData);
      this.$emit("next", { listingData: this.listingData });
    },
  },
};
</script>

<style>
</style>