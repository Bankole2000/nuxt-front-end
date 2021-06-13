<template>
  <ApolloMutation
    :mutation="require('@/graphql/config/requests/addOrUpdateCityRequest.gql')"
    :variables="{
      cityData: {
        ...cityData,
        longitude: parseFloat(cityData.longitude),
        latitude: parseFloat(cityData.latitude),
      },
    }"
    class="form"
    @done="savedCityRequest"
  >
    <template slot-scope="{ mutate }">
      <form v-on:submit.prevent="formValid && mutate()">
        <v-row class="mt-3 pb-0">
          <v-col cols="12" sm="12" class="pt-1">
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
                  <v-select
                    outlined
                    dense
                    readonly
                    cols="10"
                    class="mb-2"
                    type="text"
                    autocomplete="off"
                    v-model="selectedCountry"
                    @change="selectCountry"
                    :items="data.countries"
                    return-object
                    hide-details
                    item-text="name"
                    placeholder="Select Country"
                  >
                    <template v-slot:label>
                      <p class="my-0">
                        Country <span class="error--text">*</span>
                      </p>
                    </template>
                    <template v-slot:selection="{ item }">
                      <p class="my-0">
                        <span left class="mr-2" v-html="item.emoji">{{
                          item.emoji
                        }}</span>
                        <span v-text="item.name"></span>
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
                  </v-select>
                </div>

                <!-- No result -->
                <div v-else class="no-result apollo">No result :(</div>
              </template>
            </ApolloQuery>
            <v-text-field
              v-model="cityData.countryCode"
              placeholder="Country Code"
              class="mb-2"
              cols="2"
              readonly
              prepend-inner-icon="mdi-flag"
              outlined
              hide-details
              counter
              dense
            >
              <template v-slot:label>
                <p class="my-0">
                  Country Code <span class="error--text">*</span>
                </p>
              </template>
            </v-text-field>
            <ApolloQuery
              :query="require('@/graphql/data/states.gql')"
              :variables="{
                countryCode: selectedCountryCode,
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
                  <v-expand-transition>
                    <v-select
                      outlined
                      dense
                      v-show="stateIsListed"
                      cols="10"
                      class="mb-2"
                      type="text"
                      autocomplete="off"
                      v-model="selectedState"
                      @change="selectState"
                      :items="data.statesByCountry"
                      return-object
                      hide-details
                      item-text="name"
                      placeholder="Select State"
                    >
                      <template v-slot:label>
                        <p class="my-0">
                          State <span class="error--text">*</span>
                        </p>
                      </template>
                      <template v-slot:selection="{ item }">
                        <p class="my-0">
                          <span left class="mr-2" v-html="item.emoji">{{
                            item.stateCode
                          }}</span>
                          <span v-text="item.name"></span>
                        </p>
                      </template>
                      <template v-slot:item="{ item }">
                        <v-list-item-avatar
                          color="indigo"
                          class="headline font-weight-light white--text"
                        >
                          {{ item.stateCode }}
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
                    </v-select>
                  </v-expand-transition>
                </div>

                <!-- No result -->
                <div v-else class="no-result apollo">No result :(</div>
              </template>
            </ApolloQuery>
            <v-switch
              v-model="stateIsListed"
              hide-details
              class="mt-0 mb-3"
              :label="`${
                stateIsListed
                  ? 'My State is on the list (Select above)'
                  : 'My State isn\'t on the list (enter below)'
              }`"
            ></v-switch>
            <v-expand-transition>
              <v-text-field
                v-model="cityData.stateName"
                v-show="!stateIsListed"
                placeholder="State Name"
                class="mb-2"
                autocomplete="off"
                prepend-inner-icon="mdi-pen"
                outlined
                hide-details
                dense
              >
                <template v-slot:label>
                  <p class="my-0">
                    State Name <span class="error--text">*</span>
                  </p>
                </template>
              </v-text-field>
            </v-expand-transition>
            <v-text-field
              v-model.trim="cityData.stateCode"
              :disabled="stateIsListed"
              placeholder="e.g. TX (Texas)"
              class="mb-2"
              :rules="[rules.max]"
              prepend-inner-icon="mdi-pen"
              outlined
              :hide-details="stateIsListed"
              autocomplete="off"
              hint="Max 2 Chars - Usually the first Letter and next consonant of the state name"
              :persistent-hint="!stateIsListed"
              dense
            >
              <template v-slot:label>
                <p class="my-0">
                  State Code <span class="error--text">*</span>
                </p>
              </template>
            </v-text-field>
            <v-text-field
              v-model="cityData.name"
              placeholder="City Name"
              class="mb-2"
              autocomplete="off"
              prepend-inner-icon="mdi-home-city"
              outlined
              hide-details
              dense
            >
              <template v-slot:label>
                <p class="my-0">City Name <span class="error--text">*</span></p>
              </template>
            </v-text-field>

            <div style="display: flex">
              <v-text-field
                v-model="cityData.latitude"
                dense
                autocomplete="off"
                type="number"
                class="mx-1"
                prepend-inner-icon="mdi-map-marker"
                outlined
                hide-details
                label="latitude (optional)"
              >
              </v-text-field>
              <v-text-field
                v-model="cityData.longitude"
                dense
                autocomplete="off"
                class="mx-1"
                prepend-inner-icon="mdi-map-marker"
                outlined
                hide-details
                label="longitude (optional)"
              >
              </v-text-field>
            </div>
            <v-expand-transition>
              <v-alert v-show="message" dark class="my-2 py-2" color="info">
                <div
                  style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                  "
                >
                  {{ message }}
                  <v-btn text @click="message = ''">ok</v-btn>
                </div>
              </v-alert>
            </v-expand-transition>
            <v-divider class="mt-2"></v-divider>
          </v-col>
          <div style="display: flex; justify-content: flex-end; width: 100%">
            <v-btn type="submit" :disabled="!formValid" color="primary"
              ><v-icon left>mdi-send</v-icon> Send Request</v-btn
            >
            <v-btn class="ml-2 mr-3" @click="clearForm">
              <v-icon left>mdi-restore</v-icon>
              Clear
            </v-btn>
          </div>
        </v-row>
      </form>
    </template>
  </ApolloMutation>
</template>

<script>
import COUNTRYBYCODE from "@/graphql/data/countryByCode.gql";
import STATEBYCODE from "@/graphql/data/stateByCode.gql";
import { mapActions } from "vuex";
export default {
  props: ["selectedCountryCode", "selectedStateCode"],
  data() {
    return {
      cityData: {
        id: "",
        name: "",
        stateName: "",
        stateCode: "",
        countryCode: "",
        countryName: "",
        latitude: 0,
        longitude: 0,
        addedToData: false,
      },
      stateIsListed: false,
      message: "",
      selectedCountry: null,
      selectedState: null,
      rules: {
        required: (value) =>
          !!value ||
          "Required. Usually the first Letter and next consonant of the state name",
        max: (v) =>
          v?.length <= 2 ||
          "Max 2 characters - Usually the first Letter and next consonant of the state name",
      },
    };
  },
  computed: {
    formValid() {
      if (
        this.cityData.name &&
        this.cityData.stateCode &&
        this.cityData.stateCode.length <= 2 &&
        this.cityData.countryCode &&
        this.cityData.countryName
      ) {
        return true;
      }
      return false;
    },
  },
  methods: {
    ...mapActions(["showToast"]),
    async getPreselectedState() {
      const data = await this.$apollo.query({
        query: STATEBYCODE,
        variables: {
          countryCode: this.selectedCountryCode,
          stateCode: this.selectedStateCode,
        },
      });
      console.log(data);
      const { stateByCode } = data.data;
      if (stateByCode) {
        this.stateIsListed = true;
        const { name, stateCode } = stateByCode;
        this.selectedState = stateByCode;

        this.cityData.stateName = name;
        this.cityData.stateCode = stateCode;
        return;
      }
      this.cityData.stateCode = this.selectedStateCode;
    },
    async getPreselectedCountry() {
      const data = await this.$apollo.query({
        query: COUNTRYBYCODE,
        variables: {
          countryCode: this.selectedCountryCode,
        },
      });
      console.log(data);
      this.selectedCountry = await data.data.countryByCode;
      this.cityData.countryCode = this.selectedCountryCode;
      this.cityData.countryName = this.selectedCountry.name;
    },
    selectCountry(e) {
      console.log({ e });
      if (!e) {
        this.cityData.countryCode = e;
        this.cityData.countryName = e;
        return;
      }
      this.cityData.countryCode = e.countryCode;
      this.cityData.countryName = e.name;
    },
    selectState(e) {
      console.log({ e });
      if (!e) {
        this.cityData.stateCode = e;
        this.cityData.stateName = e;
        return;
      }
      this.cityData.stateCode = e.stateCode;
      this.cityData.stateName = e.name;
    },
    savedCityRequest(e) {
      console.log({ cityData: this.cityData });
      console.log({ e });
      this.$emit("cityRequestSent", { cityData: this.cityData });
      this.message = "🙏Thanks! Your request has been sent";
      this.cityData.name = "";
      this.cityData.stateCode = this.selectedStateCode
        ? this.selectedStateCode
        : "";

      this.showToast({
        show: true,
        message: `City Add Request ${this.cityData.id ? "Updated" : "Added"}`,
        sclass: "success",
        timeout: 3000,
      }).then((timeout) => {
        setTimeout(() => {
          this.showToast({ show: false });
        }, timeout);
      });
    },
    clearForm() {
      this.cityData = {
        ...this.cityData,
        id: "",
        name: "",
        stateCode: "",
        latitude: 0,
        longitude: 0,
        addedToData: false,
      };
      this.message = "";
    },
  },
  beforeMount() {
    this.getPreselectedCountry().then(() => {
      this.getPreselectedState();
    });
  },
};
</script>

<style>
</style>