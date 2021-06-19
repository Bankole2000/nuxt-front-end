<template>
  <div class="cityAddRequests-config">
    <v-card class="mb-2" tile elevation="8">
      <v-card-title class="primary white--text">
        City Add Requests
        <v-spacer></v-spacer>
        <v-expand-x-transition>
          <v-card v-show="show" class="transparent" :elevation="0">
            <v-text-field
              v-model="searchText"
              dense
              :sort-by.sync="sortBy"
              :sort-desc.sync="sortDesc"
              prepend-inner-icon="mdi-magnify"
              placeholder="Search City Add Requests"
              label="Search City Add Requests"
              solo
              hide-details
            ></v-text-field>
          </v-card>
        </v-expand-x-transition>
        <v-spacer></v-spacer>
        <v-btn icon @click="show = !show">
          <v-icon
            :color="show ? 'secondary' : 'white'"
            :style="{
              transform: `${show ? 'rotate(180deg)' : 'rotate(0deg)'}`,
              transition: 'all 0.2s ease-out',
            }"
            >mdi-chevron-double-up</v-icon
          >
        </v-btn>
      </v-card-title>
      <v-expand-transition>
        <div v-show="show">
          <v-card-text class="pt-0">
            <v-tabs v-model="tab">
              <v-tab> City Requests </v-tab>
              <v-tab> {{ cityData.id ? "Edit" : "Add" }} City Request </v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab">
              <!-- CityRequests DataTable -->
              <v-tab-item>
                <ApolloQuery
                  :query="
                    require('@/graphql/config/requests/cityAddRequests.gql')
                  "
                  :variables="{ searchText }"
                >
                  <ApolloSubscribeToMore
                    :document="
                      require('@/graphql/config/requests/cityAddRequestAdded.gql')
                    "
                    :update-query="onCityRequestAdded"
                  />
                  <template slot-scope="{ result: { loading, error, data } }">
                    <!-- Loading -->
                    <div v-if="loading" class="loading apollo">Loading...</div>

                    <!-- Error -->
                    <div v-else-if="error" class="error apollo">
                      An error occured
                    </div>

                    <!-- Result -->
                    <div v-else-if="data" class="result apollo">
                      <v-data-table
                        :headers="headers"
                        dense
                        :items="
                          data.cityAddRequests.map((item, i) => {
                            return { ...item, sno: i + 1 };
                          })
                        "
                        :mobile-breakpoint="0"
                        :items-per-page="5"
                        class="elevation-1"
                      >
                        <template v-slot:[`item.addedToData`]="{ item }">
                          <div>
                            <v-icon
                              :color="item.addedToData ? 'success' : 'error'"
                              >{{
                                item.addedToData
                                  ? "mdi-checkbox-marked"
                                  : "mdi-checkbox-blank-outline"
                              }}</v-icon
                            >
                          </div>
                        </template>
                        <template v-slot:[`item.actions`]="{ item }">
                          <div style="display: flex">
                            <v-tooltip top>
                              <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                  icon
                                  v-bind="attrs"
                                  v-on="on"
                                  @click="editItem(item)"
                                >
                                  <v-icon small> mdi-pencil </v-icon>
                                </v-btn>
                              </template>
                              <span>Edit</span>
                            </v-tooltip>
                            <v-tooltip top>
                              <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                  icon
                                  v-bind="attrs"
                                  v-on="on"
                                  @click="deleteItem(item)"
                                >
                                  <v-icon small> mdi-delete </v-icon>
                                </v-btn>
                              </template>
                              <span>Delete</span>
                            </v-tooltip>
                          </div>
                        </template></v-data-table
                      >
                    </div>

                    <!-- No result -->
                    <div v-else class="no-result apollo">No result :(</div>
                  </template>
                </ApolloQuery>
              </v-tab-item>
              <!-- CityRequests Form -->
              <v-tab-item>
                <ApolloMutation
                  :mutation="
                    require('@/graphql/config/requests/addOrUpdateCityRequest.gql')
                  "
                  :variables="{
                    cityData: {
                      ...cityData,
                      longitude: parseFloat(cityData.longitude),
                      latitude: parseFloat(cityData.latitude),
                    },
                  }"
                  class="form"
                  @done="savedHobby"
                >
                  <template slot-scope="{ mutate }">
                    <form v-on:submit.prevent="formValid && mutate()">
                      <v-row class="mt-3 pb-4">
                        <v-col cols="12" sm="6">
                          <ApolloQuery
                            :query="require('@/graphql/data/countries.gql')"
                          >
                            <template
                              slot-scope="{ result: { loading, error, data } }"
                            >
                              <!-- Loading -->
                              <div v-if="loading" class="loading apollo">
                                Loading...
                              </div>

                              <!-- Error -->
                              <div v-else-if="error" class="error apollo">
                                <!-- An error occured -->
                              </div>

                              <!-- Result -->
                              <div v-else-if="data" class="result apollo">
                                <v-autocomplete
                                  clearable
                                  outlined
                                  dense
                                  type="text"
                                  class="mb-2"
                                  autocomplete="off"
                                  v-model="selectedCountry"
                                  @change="selectCountry"
                                  label="Country"
                                  :items="data.countries"
                                  return-object
                                  hide-details
                                  item-text="name"
                                  placeholder="Select Country"
                                >
                                  <template v-slot:selection="{ item }">
                                    <p class="my-0">
                                      <span
                                        left
                                        class="mr-2"
                                        v-html="item.emoji"
                                        >{{ item.emoji }}</span
                                      >
                                      <span v-text="item.name"></span>
                                    </p>
                                  </template>
                                  <template v-slot:item="{ item }">
                                    <v-list-item-avatar
                                      color="indigo"
                                      class="
                                        headline
                                        font-weight-light
                                        white--text
                                      "
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
                              <div v-else class="no-result apollo">
                                No result :(
                              </div>
                            </template>
                          </ApolloQuery>
                          <ApolloQuery
                            v-if="selectedCountry"
                            :query="require('@/graphql/data/states.gql')"
                            :variables="{
                              countryCode: selectedCountry.countryCode,
                            }"
                          >
                            <template
                              slot-scope="{ result: { loading, error, data } }"
                            >
                              <!-- Loading -->
                              <div v-if="loading" class="loading apollo">
                                Loading...
                              </div>

                              <!-- Error -->
                              <div v-else-if="error" class="error apollo">
                                <!-- An error occured -->
                              </div>

                              <!-- Result -->
                              <div v-else-if="data" class="result apollo">
                                <v-autocomplete
                                  clearable
                                  outlined
                                  dense
                                  type="text"
                                  class="mb-2"
                                  autocomplete="off"
                                  v-model="selectedState"
                                  @change="selectState"
                                  label="State"
                                  :items="data.statesByCountry"
                                  return-object
                                  hide-details
                                  item-text="name"
                                  placeholder="Select State"
                                >
                                  <template v-slot:selection="{ item }">
                                    <p class="my-0">
                                      <span
                                        left
                                        class="mr-2"
                                        v-html="item.stateCode"
                                      ></span>
                                      <span v-text="item.name"></span>
                                    </p>
                                  </template>
                                  <template v-slot:item="{ item }">
                                    <v-list-item-avatar
                                      color="indigo"
                                      class="
                                        headline
                                        font-weight-light
                                        white--text
                                      "
                                    >
                                      {{ item.stateCode }}
                                    </v-list-item-avatar>
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
                              </div>

                              <!-- No result -->
                              <div v-else class="no-result apollo">
                                No result :(
                              </div>
                            </template>
                          </ApolloQuery>
                          <v-text-field
                            v-model="cityData.name"
                            placeholder="City Name"
                            class="mb-2"
                            prepend-inner-icon="mdi-pen"
                            outlined
                            hide-details
                            dense
                            label="City Name"
                          >
                          </v-text-field>

                          <v-checkbox
                            v-model="cityData.addedToData"
                            label="Has been added to Backend Data"
                          ></v-checkbox>
                        </v-col>
                        <v-col cols="12" sm="3">
                          <v-text-field
                            v-model="cityData.stateCode"
                            placeholder="State Code"
                            class="mb-2"
                            :rules="[rules.required, rules.max]"
                            prepend-inner-icon="mdi-pen"
                            outlined
                            hide-details
                            counter
                            dense
                            label="State Code"
                          >
                          </v-text-field>
                          <v-text-field
                            v-model="cityData.latitude"
                            dense
                            type="number"
                            class="mb-2"
                            prepend-inner-icon="mdi-map-marker"
                            outlined
                            hide-details
                            label="latitude"
                          >
                          </v-text-field>
                          <v-btn @click="clearForm" block>
                            <v-icon left>mdi-restore</v-icon>
                            Clear
                          </v-btn>
                        </v-col>
                        <v-col cols="12" sm="3">
                          <v-text-field
                            v-model="cityData.countryCode"
                            placeholder="Country Code"
                            class="mb-2"
                            readonly
                            prepend-inner-icon="mdi-flag"
                            outlined
                            hide-details
                            counter
                            dense
                            label="Country Code"
                          >
                          </v-text-field>
                          <v-text-field
                            v-model="cityData.longitude"
                            dense
                            class="mb-2"
                            prepend-inner-icon="mdi-map-marker"
                            outlined
                            hide-details
                            label="longitude"
                          >
                          </v-text-field>
                          <v-btn
                            type="submit"
                            :disabled="!formValid"
                            block
                            color="primary"
                            ><v-icon left>mdi-content-save</v-icon>
                            {{ cityData.id ? "Update" : "Save" }}</v-btn
                          >
                        </v-col>
                      </v-row>
                    </form>
                  </template>
                </ApolloMutation>
              </v-tab-item>
            </v-tabs-items>
          </v-card-text>
        </div>
      </v-expand-transition>
    </v-card>
  </div>
</template>

<script>
import emojis from "../data/emoji.json";
import { mapActions } from "vuex";
import CITY_REQUESTS_QUERY from "@/graphql/config/requests/cityAddRequests.gql";
import DELETE_QUERY from "@/graphql/config/requests/deleteCityAddRequest.gql";
import COUNTRYBYCODE from "@/graphql/data/countryByCode.gql";
import STATEBYCODE from "@/graphql/data/stateByCode.gql";

export default {
  data() {
    return {
      show: true,
      searchText: "",
      sortBy: "name",
      sortDesc: false,
      tab: 0,
      emojis,
      headers: [
        {
          text: "S/N",
          align: "start",
          sortable: false,
          value: "sno",
        },
        { text: "ID", value: "id" },
        { text: "Name", value: "name" },
        { text: "State Code", sortable: false, value: "stateCode" },
        { text: "State Name", sortable: false, value: "stateName" },
        { text: "Country Code", sortable: false, value: "countryCode" },
        { text: "Country Name", sortable: false, value: "countryName" },
        { text: "Added", sortable: false, value: "addedToData" },
        { text: "Actions", value: "actions" },
      ],
      cityData: {
        id: "",
        name: "",
        stateCode: "",
        stateName: "",
        countryCode: "",
        countryName: "",
        latitude: 0,
        longitude: 0,
        addedToData: false,
      },
      selectedCountry: null,
      selectedState: null,
      rules: {
        required: (value) => !!value || "Required.",
        max: (v) => v?.length <= 5 || "up to 5 characters only",
      },
    };
  },
  computed: {
    formValid() {
      if (
        this.cityData.name &&
        this.cityData.stateCode &&
        this.cityData.stateCode.length <= 5 &&
        this.cityData.stateName &&
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
    customFilter(item, queryText, itemText) {
      console.log(item, queryText, itemText);
      const textOne = item.name.toLowerCase();
      const textTwo = item.group.toLowerCase();
      const searchText = queryText.toLowerCase();

      return (
        textOne.indexOf(searchText) > -1 || textTwo.indexOf(searchText) > -1
      );
    },
    remove(data, item) {
      this.cityData.emoticon = "";
      console.log({ data, item });
    },
    savedHobby() {
      console.log({ cityData: this.cityData });

      this.showToast({
        show: true,
        message: `Hobby ${this.cityData.id ? "Updated" : "Added"}`,
        sclass: "success",
      }).then((timeout) => {
        this.clearForm();
        setTimeout(() => {
          this.showToast({ show: false });
        }, timeout);
      });
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
      }
      this.cityData.stateCode = e.stateCode;
      this.cityData.stateName = e.name;
    },
    onCityRequestAdded(previousResult, { subscriptionData }) {
      console.log({ previousResult, subscriptionData });
      const newId = subscriptionData.data.cityAddRequestAdded.id;
      if (previousResult.cityAddRequests.find((x) => x.id === newId)) {
        return {
          cityAddRequests: previousResult.cityAddRequests.map((obj) => {
            // return previousResult.cityAddRequests.find((o) => o.id === newId) || obj;
            return obj.id == newId
              ? subscriptionData.data.cityAddRequestAdded
              : obj;
          }),
        };
      }
      return {
        cityAddRequests: [
          ...previousResult.cityAddRequests,
          subscriptionData.data.cityAddRequestAdded,
        ],
      };
    },
    clearForm() {
      this.cityData = {
        id: "",
        name: "",
        stateCode: "",
        stateName: "",
        countryCode: "",
        countryName: "",
        latitude: 0,
        longitude: 0,
        addedToData: false,
      };
      this.selectedCountry = null;
      this.tab = 0;
    },
    async editItem(item) {
      console.log({ item });
      const {
        id,
        name,
        stateCode,
        stateName,
        countryCode,
        countryName,
        latitude,
        longitude,
        addedToData,
      } = item;
      this.cityData = {
        id,
        name,
        stateCode,
        stateName,
        countryCode,
        countryName,
        latitude,
        longitude,
        addedToData,
      };
      const data = await this.$apollo.query({
        query: COUNTRYBYCODE,
        variables: {
          countryCode,
        },
      });
      const stateData = await this.$apollo.query({
        query: STATEBYCODE,
        variables: {
          countryCode,
          stateCode,
        },
      });
      console.log(data, stateData);
      this.selectedCountry = await data.data.countryByCode;
      this.selectedState = await stateData.data.stateByCode;
      this.tab = 1;
    },
    deleteItem(item) {
      console.log({ item });
      this.$apollo.mutate({
        mutation: DELETE_QUERY,
        variables: {
          cityAddRequestId: item.id,
        },
        update: (
          store,
          {
            data: {
              deleteCityAddRequest: { id },
            },
          }
        ) => {
          console.log({ id });
          const data = store.readQuery({
            query: CITY_REQUESTS_QUERY,
            variables: {
              searchText: "",
            },
          });
          data.cityAddRequests = data.cityAddRequests.filter((x) => x.id != id);

          store.writeQuery({
            query: CITY_REQUESTS_QUERY,
            variables: {
              searchText: "",
            },
            data,
          });
          this.showToast({
            show: true,
            message: "City Add Request Deleted",
            sclass: "info",
          }).then((timeout) => {
            setTimeout(() => {
              this.showToast({ show: false });
            }, timeout);
          });
        },
      });
    },
  },
};
</script>

<style>
</style>