<template>
  <ApolloMutation
    :mutation="require('@/graphql/config/requests/addOrUpdateStateRequest.gql')"
    :variables="{
      stateData: {
        ...stateData,
        longitude: parseFloat(stateData.longitude),
        latitude: parseFloat(stateData.latitude),
      },
    }"
    class="form"
    @done="savedStateRequest"
  >
    <template slot-scope="{ mutate }">
      <form v-on:submit.prevent="formValid && mutate()">
        <v-row class="mt-3 pb-4">
          <v-col cols="12" sm="12">
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
              v-model="stateData.countryCode"
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
            <v-text-field
              v-model="stateData.name"
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
            <v-text-field
              v-model.trim="stateData.stateCode"
              placeholder="e.g. TX (Texas)"
              class="mb-2"
              :rules="[rules.max]"
              prepend-inner-icon="mdi-pen"
              outlined
              autocomplete="off"
              hint="Max 2 Chars - Usually the first Letter and next consonant of the state name"
              persistent-hint
              dense
            >
              <template v-slot:label>
                <p class="my-0">
                  State Code <span class="error--text">*</span>
                </p>
              </template>
            </v-text-field>
            <div style="display: flex">
              <v-text-field
                v-model="stateData.latitude"
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
                v-model="stateData.longitude"
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
import { mapActions } from "vuex";
export default {
  props: ["selectedCountryCode"],
  data() {
    return {
      stateData: {
        id: "",
        name: "",
        stateCode: "",
        countryCode: "",
        countryName: "",
        latitude: 0,
        longitude: 0,
        addedToData: false,
      },
      message: "",
      selectedCountry: null,
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
        this.stateData.name &&
        this.stateData.stateCode &&
        this.stateData.stateCode.length <= 2 &&
        this.stateData.countryCode &&
        this.stateData.countryName
      ) {
        return true;
      }
      return false;
    },
  },
  methods: {
    ...mapActions(["showToast"]),
    async getPreselectedCountry() {
      const data = await this.$apollo.query({
        query: COUNTRYBYCODE,
        variables: {
          countryCode: this.selectedCountryCode,
        },
      });
      console.log(data);
      this.selectedCountry = await data.data.countryByCode;
      this.stateData.countryCode = this.selectedCountryCode;
      this.stateData.countryName = this.selectedCountry.name;
    },
    selectCountry(e) {
      console.log({ e });
      if (!e) {
        this.stateData.countryCode = e;
        this.stateData.countryName = e;
        return;
      }
      this.stateData.countryCode = e.countryCode;
      this.stateData.countryName = e.name;
    },
    savedStateRequest() {
      console.log({ stateData: this.stateData });
      this.message = "🙏Thanks! Your request has been sent";
      this.$emit("stateRequestSent", { stateData: this.stateData });
      this.stateData.name = "";
      this.stateData.stateCode = "";

      this.showToast({
        show: true,
        message: `State Add Request ${this.stateData.id ? "Updated" : "Added"}`,
        sclass: "success",
        timeout: 3000,
      }).then((timeout) => {
        setTimeout(() => {
          this.showToast({ show: false });
        }, timeout);
      });
    },
    clearForm() {
      this.stateData = {
        ...this.stateData,
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
    this.getPreselectedCountry();
  },
};
</script>

<style>
</style>