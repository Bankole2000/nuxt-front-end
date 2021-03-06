<template>
  <div class="houseRules-config">
    <v-card class="mb-2" tile elevation="8">
      <v-card-title class="primary white--text">
        House Rules
        <v-spacer></v-spacer>
        <v-expand-x-transition>
          <v-card v-show="show" class="transparent" :elevation="0">
            <v-text-field
              v-model="searchText"
              dense
              :sort-by.sync="sortBy"
              :sort-desc.sync="sortDesc"
              prepend-inner-icon="mdi-magnify"
              placeholder="Search House Rules"
              label="Search House Rules"
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
              <v-tab> House Rules </v-tab>
              <v-tab>
                {{ houseRuleData.id ? "Edit" : "Add" }} House Rule
              </v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab">
              <!-- HouseRules DataTable -->
              <v-tab-item>
                <ApolloQuery
                  :query="require('@/graphql/config/houseRules/houseRules.gql')"
                  :variables="{ searchText }"
                >
                  <ApolloSubscribeToMore
                    :document="
                      require('@/graphql/config/houseRules/houseRuleAdded.gql')
                    "
                    :update-query="onHouseRuleAdded"
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
                          data.houseRules.map((item, i) => {
                            return { ...item, sno: i + 1 };
                          })
                        "
                        :mobile-breakpoint="0"
                        :items-per-page="5"
                        class="elevation-1"
                      >
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
                        </template>
                        <template v-slot:[`item.mdiIconTrue`]="{ item }">
                          <v-icon>mdi-{{ item.mdiIconTrue }}</v-icon>
                        </template>
                        <template v-slot:[`item.mdiIconFalse`]="{ item }">
                          <v-icon>mdi-{{ item.mdiIconFalse }}</v-icon>
                        </template>
                      </v-data-table>
                    </div>

                    <!-- No result -->
                    <div v-else class="no-result apollo">No result :(</div>
                  </template>
                </ApolloQuery>
              </v-tab-item>
              <!-- HouseRules Form -->
              <v-tab-item>
                <ApolloMutation
                  :mutation="
                    require('@/graphql/config/houseRules/addOrUpdateHouseRules.gql')
                  "
                  :variables="{
                    houseRuleData: houseRuleData,
                  }"
                  class="form"
                  @done="savedHouseRule"
                >
                  <template slot-scope="{ mutate }">
                    <form v-on:submit.prevent="formValid && mutate()">
                      <v-row class="mt-3 pb-4">
                        <v-col cols="12" sm="6">
                          <v-text-field
                            v-model="houseRuleData.title"
                            class="mb-2"
                            dense
                            prepend-inner-icon="mdi-pen"
                            outlined
                            hide-details
                            placeholder="e.g. Swimming"
                            label="Title"
                          >
                          </v-text-field>
                          <v-textarea
                            placeholder="description"
                            outlined
                            class="mb-2"
                            label="Description"
                            rows="1"
                            hide-details
                            prepend-inner-icon="mdi-pencil"
                            v-model="houseRuleData.description"
                          ></v-textarea>

                          <v-autocomplete
                            prepend-inner-icon="mdi-check"
                            outlined
                            class="mb-2"
                            dense
                            :items="mdiIcons"
                            placeholder="mdi icon"
                            v-model="houseRuleData.mdiIconTrue"
                            flat
                            :append-icon="`mdi-${houseRuleData.mdiIconTrue}`"
                            prefix="mdi -"
                            hide-details
                            label="Allowed Icon"
                          >
                          </v-autocomplete>
                          <v-autocomplete
                            prepend-inner-icon="mdi-cancel"
                            outlined
                            dense
                            class="mb-2"
                            :items="mdiIcons"
                            placeholder="mdi icon"
                            v-model="houseRuleData.mdiIconFalse"
                            :append-icon="`mdi-${houseRuleData.mdiIconFalse}`"
                            flat
                            prefix="mdi -"
                            hide-details
                            label="Not Allowed Icon"
                          >
                          </v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-text-field
                            v-model="houseRuleData.code"
                            class="mb-2"
                            dense
                            prepend-inner-icon="mdi-xml"
                            outlined
                            hide-details
                            placeholder="e.g. Swimming"
                            label="Code"
                          >
                          </v-text-field>

                          <v-autocomplete
                            prepend-inner-icon="mdi-font-awesome"
                            outlined
                            dense
                            class="mb-2"
                            :items="faIcons"
                            placeholder="font-awesome icon"
                            v-model="houseRuleData.faIconTrue"
                            flat
                            hide-details
                            label="Allowed Icon"
                          >
                          </v-autocomplete>
                          <v-autocomplete
                            prepend-inner-icon="mdi-font-awesome"
                            outlined
                            dense
                            :items="faIcons"
                            placeholder="font-awesome icon"
                            v-model="houseRuleData.faIconFalse"
                            flat
                            hide-details
                            label="Not Allowed Icon"
                          >
                          </v-autocomplete>
                          <div
                            class="mt-4"
                            style="display: flex; justify-content: space-around"
                          >
                            <v-btn @click="clearForm" width="45%">
                              <v-icon left>mdi-restore</v-icon>
                              Clear
                            </v-btn>
                            <v-btn
                              type="submit"
                              :disabled="!formValid"
                              width="45%"
                              color="primary"
                              ><v-icon left>mdi-content-save</v-icon>
                              {{ houseRuleData.id ? "Update" : "Save" }}</v-btn
                            >
                          </div>
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
import faIcons from "../data/faIcons.json";
import mdiIcons from "../data/mdiIconNames.json";
import { mapActions } from "vuex";
import HOUSERULES_QUERY from "@/graphql/config/houseRules/houseRules.gql";
import DELETE_QUERY from "@/graphql/config/houseRules/deleteHouseRule.gql";

export default {
  data() {
    return {
      show: true,
      searchText: "",
      sortBy: "title",
      sortDesc: false,
      tab: 0,
      faIcons,
      mdiIcons,
      headers: [
        {
          text: "S/N",
          align: "start",
          sortable: false,
          value: "sno",
        },
        { text: "Title", value: "title" },
        { text: "Description", value: "description" },
        { text: "Allowed icon", sortable: false, value: "mdiIconTrue" },
        { text: "Icon not allowed", sortable: false, value: "mdiIconFalse" },
        { text: "Actions", value: "actions" },
      ],
      houseRuleData: {
        id: "",
        title: "",
        description: "",
        code: "",
        faIconTrue: "",
        faIconFalse: "",
        mdiIconTrue: "",
        mdiIconFalse: "",
      },
    };
  },
  computed: {
    formValid() {
      if (
        this.houseRuleData.title &&
        this.houseRuleData.description &&
        this.houseRuleData.mdiIconTrue &&
        this.houseRuleData.mdiIconFalse &&
        this.houseRuleData.faIconTrue &&
        this.houseRuleData.faIconFalse
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
      this.houseRuleData.emoticon = "";
      console.log({ data, item });
    },
    savedHouseRule() {
      console.log({ houseRuleData: this.houseRuleData });

      this.showToast({
        show: true,
        message: `House Rule ${this.houseRuleData.id ? "Updated" : "Added"}`,
        sclass: "success",
      }).then((timeout) => {
        this.clearForm();
        setTimeout(() => {
          this.showToast({ show: false });
        }, timeout);
      });
    },

    onHouseRuleAdded(previousResult, { subscriptionData }) {
      console.log({ previousResult, subscriptionData });
      const newId = subscriptionData.data.houseRuleAdded.id;
      if (previousResult.houseRules.find((x) => x.id === newId)) {
        return {
          houseRules: previousResult.houseRules.map((obj) => {
            // return previousResult.houseRules.find((o) => o.id === newId) || obj;
            return obj.id == newId ? subscriptionData.data.houseRuleAdded : obj;
          }),
        };
      }
      return {
        houseRules: [
          ...previousResult.houseRules,
          subscriptionData.data.houseRuleAdded,
        ],
      };
    },
    clearForm() {
      this.houseRuleData = {
        id: "",
        title: "",
        description: "",
        code: "",
        faIconTrue: "",
        faIconFalse: "",
        mdiIconTrue: "",
        mdiIconFalse: "",
      };
      this.tab = 0;
    },
    editItem(item) {
      console.log({ item });
      const {
        id,
        title,
        description,
        faIconTrue,
        faIconFalse,
        mdiIconTrue,
        mdiIconFalse,
        code,
      } = item;
      this.houseRuleData = {
        id,
        title,
        description,
        faIconTrue,
        faIconFalse,
        mdiIconTrue,
        mdiIconFalse,
        code,
      };
      this.tab = 1;
    },
    deleteItem(item) {
      console.log({ item });
      this.$apollo.mutate({
        mutation: DELETE_QUERY,
        variables: {
          houseRuleId: Number(item.id),
        },
        update: (
          store,
          {
            data: {
              deleteHouseRule: { id },
            },
          }
        ) => {
          console.log({ id });
          const data = store.readQuery({
            query: HOUSERULES_QUERY,
            variables: {
              searchText: "",
            },
          });
          data.houseRules = data.houseRules.filter((x) => x.id != id);

          store.writeQuery({
            query: HOUSERULES_QUERY,
            variables: {
              searchText: "",
            },
            data,
          });
          this.showToast({
            show: true,
            message: "House Rule Deleted",
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