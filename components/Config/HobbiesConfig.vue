<template>
  <div class="hobbies-config">
    <v-card class="mb-2" tile elevation="8">
      <v-card-title class="primary white--text">
        Hobbies
        <v-spacer></v-spacer>
        <v-expand-x-transition>
          <v-card v-show="show" class="transparent" :elevation="0">
            <v-text-field
              v-model="searchText"
              dense
              :sort-by.sync="sortBy"
              :sort-desc.sync="sortDesc"
              prepend-inner-icon="mdi-magnify"
              placeholder="Search Hobbies"
              label="Search Hobbies"
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
              <v-tab> Hobbies </v-tab>
              <v-tab> {{ hobbyData.id ? "Edit" : "Add" }} Hobby </v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab">
              <!-- Hobbies DataTable -->
              <v-tab-item>
                <ApolloQuery
                  :query="require('@/graphql/config/hobbies/hobbies.gql')"
                  :variables="{ searchText }"
                >
                  <ApolloSubscribeToMore
                    :document="
                      require('@/graphql/config/hobbies/hobbyAdded.gql')
                    "
                    :update-query="onHobbyAdded"
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
                          data.hobbies.map((item, i) => {
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
                        </template></v-data-table
                      >
                    </div>

                    <!-- No result -->
                    <div v-else class="no-result apollo">No result :(</div>
                  </template>
                </ApolloQuery>
              </v-tab-item>
              <!-- Hobbies Form -->
              <v-tab-item>
                <ApolloMutation
                  :mutation="
                    require('@/graphql/config/hobbies/addOrUpdateHobbies.gql')
                  "
                  :variables="{
                    hobbyData: hobbyData,
                  }"
                  class="form"
                  @done="savedHobby"
                >
                  <template slot-scope="{ mutate }">
                    <form v-on:submit.prevent="formValid && mutate()">
                      <v-row class="mt-3 pb-4">
                        <v-col cols="12" sm="6">
                          <v-textarea
                            placeholder="description"
                            outlined
                            label="Description"
                            rows="6"
                            hide-details
                            prepend-inner-icon="mdi-pencil"
                            v-model="hobbyData.description"
                          ></v-textarea>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-text-field
                            v-model="hobbyData.title"
                            class="mb-2"
                            prepend-inner-icon="mdi-pen"
                            outlined
                            hide-details
                            placeholder="e.g. Swimming"
                            label="Title"
                          >
                          </v-text-field>
                          <v-autocomplete
                            :filter="customFilter"
                            prepend-inner-icon="mdi-emoticon-excited"
                            outlined
                            :items="emojis"
                            item-value="char"
                            placeholder="Select an emoticon"
                            v-model="hobbyData.emoticon"
                            flat
                            hide-details
                            item-text="char"
                            label="Emoji"
                          >
                            <template v-slot:selection="data">
                              <v-chip
                                v-bind="data.attrs"
                                :input-value="data.selected"
                                close
                                @click="data.select"
                                @click:close="remove(data, data.item)"
                              >
                                <v-avatar left>
                                  {{ data.item.char }}
                                </v-avatar>
                                {{ data.item.name }}
                              </v-chip>
                            </template>
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
                              {{ hobbyData.id ? "Update" : "Save" }}</v-btn
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
import emojis from "../data/emoji.json";
import { mapActions } from "vuex";
import HOBBIES_QUERY from "@/graphql/config/hobbies/hobbies.gql";
import DELETE_QUERY from "@/graphql/config/hobbies/deleteHobby.gql";

export default {
  data() {
    return {
      show: true,
      searchText: "",
      sortBy: "title",
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
        { text: "Title", value: "title" },
        { text: "Description", value: "description" },
        { text: "Emoji", sortable: false, value: "emoticon" },
        { text: "Actions", value: "actions" },
      ],
      hobbyData: {
        id: "",
        title: "",
        description: "",
        emoticon: "",
      },
    };
  },
  computed: {
    formValid() {
      if (
        this.hobbyData.title &&
        this.hobbyData.description &&
        this.hobbyData.emoticon
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
      this.hobbyData.emoticon = "";
      console.log({ data, item });
    },
    savedHobby() {
      console.log({ hobbyData: this.hobbyData });

      this.showToast({
        show: true,
        message: `Hobby ${this.hobbyData.id ? "Updated" : "Added"}`,
        sclass: "success",
      }).then((timeout) => {
        this.clearForm();
        setTimeout(() => {
          this.showToast({ show: false });
        }, timeout);
      });
    },

    onHobbyAdded(previousResult, { subscriptionData }) {
      console.log({ previousResult, subscriptionData });
      const newId = subscriptionData.data.hobbyAdded.id;
      if (previousResult.hobbies.find((x) => x.id === newId)) {
        return {
          hobbies: previousResult.hobbies.map((obj) => {
            // return previousResult.hobbies.find((o) => o.id === newId) || obj;
            return obj.id == newId ? subscriptionData.data.hobbyAdded : obj;
          }),
        };
      }
      return {
        hobbies: [...previousResult.hobbies, subscriptionData.data.hobbyAdded],
      };
    },
    clearForm() {
      this.hobbyData = {
        id: "",
        title: "",
        description: "",
        emoticon: "",
      };
      this.tab = 0;
    },
    editItem(item) {
      console.log({ item });
      const { id, title, description, emoticon } = item;
      this.hobbyData = { id, title, description, emoticon };
      this.tab = 1;
    },
    deleteItem(item) {
      console.log({ item });
      this.$apollo.mutate({
        mutation: DELETE_QUERY,
        variables: {
          hobbyID: Number(item.id),
        },
        update: (
          store,
          {
            data: {
              deleteHobby: { id },
            },
          }
        ) => {
          console.log({ id });
          const data = store.readQuery({
            query: HOBBIES_QUERY,
            variables: {
              searchText: "",
            },
          });
          data.hobbies = data.hobbies.filter((x) => x.id != id);

          store.writeQuery({
            query: HOBBIES_QUERY,
            variables: {
              searchText: "",
            },
            data,
          });
          this.showToast({
            show: true,
            message: "Hobby Deleted",
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