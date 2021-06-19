<template>
  <div class="stateAddRequests-config">
    <v-card class="mb-2" tile elevation="8">
      <v-card-title class="primary white--text">
        State Add Requests
        <v-spacer></v-spacer>
        <v-expand-x-transition>
          <v-card v-show="show" class="transparent" :elevation="0">
            <v-text-field
              v-model="searchText"
              dense
              :sort-by.sync="sortBy"
              :sort-desc.sync="sortDesc"
              prepend-inner-icon="mdi-magnify"
              placeholder="Search State Add Requests"
              label="Search StateAdd Requests"
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
              <v-tab> State Requests </v-tab>
              <v-tab> {{ stateData.id ? "Edit" : "Add" }} State Request </v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab">
              <!-- StateRequests DataTable -->
              <v-tab-item>
                <ApolloQuery
                  :query="
                    require('@/graphql/config/requests/stateAddRequests.gql')
                  "
                  :variables="{ searchText }"
                >
                  <ApolloSubscribeToMore
                    :document="
                      require('@/graphql/config/requests/stateAddRequestAdded.gql')
                    "
                    :update-query="onStateRequestAdded"
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
                          data.stateAddRequests.map((item, i) => {
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
              <!-- StateRequests Form -->
              <v-tab-item>
                <ApolloMutation
                  :mutation="
                    require('@/graphql/config/requests/addOrUpdateStateRequest.gql')
                  "
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
                                  class="mb-2"
                                  type="text"
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
                          <v-text-field
                            v-model="stateData.name"
                            placeholder="State Name"
                            class="mb-2"
                            prepend-inner-icon="mdi-pen"
                            outlined
                            hide-details
                            dense
                            label="State Name"
                          >
                          </v-text-field>

                          <v-checkbox
                            v-model="stateData.addedToData"
                            label="Has been added to Backend Data"
                          ></v-checkbox>
                        </v-col>
                        <v-col cols="12" sm="3">
                          <v-text-field
                            v-model="stateData.stateCode"
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
                            v-model="stateData.latitude"
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
                            v-model="stateData.countryCode"
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
                            v-model="stateData.longitude"
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
                            {{ stateData.id ? "Update" : "Save" }}</v-btn
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
import STATE_REQUESTS_QUERY from "@/graphql/config/requests/stateAddRequests.gql";
import DELETE_QUERY from "@/graphql/config/requests/deleteStateAddRequest.gql";
import COUNTRYBYCODE from "@/graphql/data/countryByCode.gql";

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
        { text: "Code", sortable: false, value: "stateCode" },
        { text: "Country Code", sortable: false, value: "countryCode" },
        { text: "Country Name", sortable: false, value: "countryName" },
        { text: "Added", sortable: false, value: "addedToData" },
        { text: "Actions", value: "actions" },
      ],
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
      selectedCountry: null,
      rules: {
        required: (value) => !!value || "Required.",
        max: (v) => v?.length <= 5 || "up to 5 characters only",
      },
    };
  },
  computed: {
    formValid() {
      if (
        this.stateData.name &&
        this.stateData.stateCode &&
        this.stateData.stateCode.length <= 5 &&
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
      this.stateData.emoticon = "";
      console.log({ data, item });
    },
    savedStateRequest() {
      console.log({ stateData: this.stateData });

      this.showToast({
        show: true,
        message: `State Add Request ${this.stateData.id ? "Updated" : "Added"}`,
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
        this.stateData.countryCode = e;
        this.stateData.countryName = e;
        return;
      }
      this.stateData.countryCode = e.countryCode;
      this.stateData.countryName = e.name;
    },

    onStateRequestAdded(previousResult, { subscriptionData }) {
      console.log({ previousResult, subscriptionData });
      const newId = subscriptionData.data.stateAddRequestAdded.id;
      if (previousResult.stateAddRequests.find((x) => x.id === newId)) {
        return {
          stateAddRequests: previousResult.stateAddRequests.map((obj) => {
            // return previousResult.stateAddRequests.find((o) => o.id === newId) || obj;
            return obj.id == newId
              ? subscriptionData.data.stateAddRequestAdded
              : obj;
          }),
        };
      }
      return {
        stateAddRequests: [
          ...previousResult.stateAddRequests,
          subscriptionData.data.stateAddRequestAdded,
        ],
      };
    },
    clearForm() {
      this.stateData = {
        id: "",
        name: "",
        stateCode: "",
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
        countryCode,
        countryName,
        latitude,
        longitude,
        addedToData,
      } = item;
      this.stateData = {
        id,
        name,
        stateCode,
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
      console.log(data);
      this.selectedCountry = await data.data.countryByCode;
      this.tab = 1;
    },
    deleteItem(item) {
      console.log({ item });
      this.$apollo.mutate({
        mutation: DELETE_QUERY,
        variables: {
          stateAddRequestId: item.id,
        },
        update: (
          store,
          {
            data: {
              deleteStateAddRequest: { id },
            },
          }
        ) => {
          console.log({ id });
          const data = store.readQuery({
            query: STATE_REQUESTS_QUERY,
            variables: {
              searchText: "",
            },
          });
          data.stateAddRequests = data.stateAddRequests.filter(
            (x) => x.id != id
          );

          store.writeQuery({
            query: STATE_REQUESTS_QUERY,
            variables: {
              searchText: "",
            },
            data,
          });
          this.showToast({
            show: true,
            message: "State Add Request Deleted",
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