<template>
  <div class="listing-location">
    <ApolloMutation
      :mutation="require('@/graphql/listings/updateListingLocation.gql')"
      :variables="{
        updateData: listingData,
        listingUUID: listingUUID,
      }"
      class="form"
      @done="next"
    >
      <template slot-scope="{ mutate }">
        <form v-on:submit.prevent="formIsValid && mutate()">
          <v-container>
            <v-row>
              <v-col cols="12">
                <ApolloQuery :query="require('@/graphql/data/countries.gql')">
                  <template slot-scope="{ result: { loading, error, data } }">
                    <!-- Loading -->
                    <div v-if="loading" class="loading apollo">Loading...</div>

                    <!-- Error -->
                    <div v-else-if="error" class="error apollo">
                      <!-- An error occured -->
                    </div>

                    <!-- Result -->
                    <div v-else-if="data" class="result apollo">
                      <v-autocomplete
                        clearable
                        outlined
                        type="text"
                        autocomplete="offoff"
                        v-model="listingData.locationCountry"
                        label="Country"
                        :items="data.countries"
                        item-value="countryCode"
                        item-text="name"
                        placeholder="Select A Country..."
                        hint="What Country is this listing located"
                      >
                        <template v-slot:selection="{ item }">
                          <p class="my-0">
                            <span left class="mr-2" v-html="item.emoji">{{
                              item.emoji
                            }}</span>
                            <span
                              v-text="item.name"
                              style="font-size: 1.2rem"
                            ></span>
                          </p>
                        </template>
                        <template v-slot:item="{ item }">
                          <v-list-item-avatar
                            color="indigo"
                            class="headline font-weight-light white--text"
                          >
                            {{ item.emoji }}
                          </v-list-item-avatar>
                          <v-list-item-content>
                            <v-list-item-title
                              v-text="item.name"
                            ></v-list-item-title>
                            <v-list-item-subtitle
                              v-text="item.countryCode"
                            ></v-list-item-subtitle>
                          </v-list-item-content>
                        </template>
                      </v-autocomplete>
                    </div>

                    <!-- No result -->
                    <div v-else class="no-result apollo">No result :(</div>
                  </template>
                </ApolloQuery>
                <ApolloQuery
                  v-if="listingData.locationCountry"
                  :query="require('@/graphql/data/states.gql')"
                  :variables="{
                    countryCode: listingData.locationCountry,
                  }"
                >
                  <template slot-scope="{ result: { loading, error, data } }">
                    <!-- Loading -->
                    <div v-if="loading" class="loading apollo">Loading...</div>

                    <!-- Error -->
                    <div v-else-if="error" class="error apollo">
                      <!-- An error occured -->
                    </div>

                    <!-- Result -->
                    <div v-else-if="data" class="result apollo">
                      <v-scroll-y-transition leave-absolute>
                        <v-autocomplete
                          clearable
                          outlined
                          v-show="!customState"
                          type="text"
                          autocomplete="offoff"
                          v-model="listingData.locationState"
                          label="State"
                          :items="data.statesByCountry"
                          item-value="stateCode"
                          item-text="name"
                          placeholder="Select A State..."
                          hint="What State/District is this listing located in"
                        >
                          <template v-slot:append-outer>
                            <StateAddRequestModal
                              :selectedCountryCode="listingData.locationCountry"
                              @stateRequestSent="stateRequestSent"
                            />
                          </template>
                          <template v-slot:selection="{ item }">
                            <p class="my-0">
                              <span
                                v-text="item.name"
                                style="font-size: 1.2rem"
                              ></span>
                            </p>
                          </template>
                          <template v-slot:item="{ item }">
                            <v-list-item-content>
                              <v-list-item-title
                                v-text="item.name"
                              ></v-list-item-title>
                              <v-list-item-subtitle
                                v-text="item.stateCode"
                              ></v-list-item-subtitle>
                            </v-list-item-content>
                          </template>
                        </v-autocomplete>
                      </v-scroll-y-transition>
                      <v-scroll-y-reverse-transition>
                        <v-text-field
                          v-show="customState"
                          outlined
                          v-model="listingData.locationState"
                          readonly
                          label="State Code"
                        >
                        </v-text-field>
                      </v-scroll-y-reverse-transition>
                    </div>

                    <!-- No result -->
                    <div v-else class="no-result apollo">No result :(</div>
                  </template>
                </ApolloQuery>
                <ApolloQuery
                  v-if="listingData.locationState"
                  :query="require('@/graphql/data/cities.gql')"
                  :variables="{
                    countryCode: listingData.locationCountry,
                    stateCode: listingData.locationState,
                  }"
                >
                  <template slot-scope="{ result: { loading, error, data } }">
                    <!-- Loading -->
                    <div v-if="loading" class="loading apollo">Loading...</div>

                    <!-- Error -->
                    <div v-else-if="error" class="error apollo">
                      <!-- An error occured -->
                    </div>

                    <!-- Result -->
                    <div v-else-if="data" class="result apollo">
                      <v-scroll-y-transition leave-absolute>
                        <v-autocomplete
                          clearable
                          outlined
                          v-show="!customCity"
                          type="text"
                          autocomplete="offSelect A City..."
                          v-model="listingData.locationCity"
                          label="City"
                          :items="data.citiesByState"
                          item-value="countryCode"
                          item-text="name"
                          placeholder="Select A City..."
                          hint="What City is this listing located"
                        >
                          <template v-slot:append-outer>
                            <CityAddRequestModal
                              :selectedCountryCode="listingData.locationCountry"
                              :selectedStateCode="listingData.locationState"
                              @cityRequestSent="cityRequestSent"
                            />
                          </template>
                          <template v-slot:selection="{ item }">
                            <p class="my-0">
                              <span
                                v-text="item.name"
                                style="font-size: 1.2rem"
                              ></span>
                            </p>
                          </template>

                          <template v-slot:item="{ item }">
                            <v-list-item-content>
                              <v-list-item-title
                                v-text="item.name"
                              ></v-list-item-title>
                              <v-list-item-subtitle
                                v-text="item.name"
                              ></v-list-item-subtitle>
                            </v-list-item-content>
                          </template>
                        </v-autocomplete>
                      </v-scroll-y-transition>
                      <v-scroll-y-reverse-transition>
                        <v-text-field
                          v-show="customCity"
                          outlined
                          v-model="listingData.locationCity"
                          label="City Name"
                          readonly
                        >
                        </v-text-field>
                      </v-scroll-y-reverse-transition>
                    </div>

                    <!-- No result -->
                    <div v-else class="no-result apollo">No result :(</div>
                  </template>
                </ApolloQuery>
                <v-btn
                  type="submit"
                  :disabled="!formIsValid"
                  block
                  color="primary"
                  x-large
                  ><span class="title">{{
                    formIsValid ? "Let's Go!" : "Ready?"
                  }}</span>
                  <v-icon right>mdi-arrow-right-circle</v-icon></v-btn
                >
              </v-col>
            </v-row>
          </v-container>
        </form>
      </template>
    </ApolloMutation>
  </div>
</template>

<script>
import CityAddRequestModal from "~/components/Modals/CityAddRequestModal.vue";
import StateAddRequestModal from "~/components/Modals/StateAddRequestModal.vue";

export default {
  components: { StateAddRequestModal, CityAddRequestModal },
  props: ["listingUUID"],
  data() {
    return {
      listingData: {
        locationCountry: "",
        locationState: "",
        locationCity: "",
      },
      customState: false,
      customCity: false,
    };
  },
  computed: {
    formIsValid() {
      if (
        this.listingData.locationCountry &&
        this.listingData.locationState &&
        this.listingData.locationCity
      ) {
        return true;
      }
      return false;
    },
  },
  methods: {
    next(e) {
      console.log({ e });
      console.log({ listingData: this.listingData });
      this.$emit("next", { listingData: this.listingData });
    },
    cityRequestSent(e) {
      console.log(e.e.cityData);
      const { name, stateCode } = e.e.cityData;
      this.customCity = true;
      this.listingData.locationState = stateCode;
      this.listingData.locationCity = name;
    },
    stateRequestSent(e) {
      console.log({ e });
      console.log(e.e.stateData);
      const { name, stateCode } = e.e.stateData;
      this.customState = true;
      this.listingData.locationState = stateCode;
      this.listingData.locationCity = "";
    },
  },
};
</script>

<style>
</style>