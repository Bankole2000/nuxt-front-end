<template>
  <div class="amenities-config">
    <v-card class="mb-2" tile elevation="8">
      <v-card-title class="primary white--text">
        Listing Amenities
        <v-spacer></v-spacer>
        <v-expand-x-transition>
          <v-card v-show="show" class="transparent" :elevation="0">
            <v-text-field
              v-model="searchText"
              dense
              :sort-by.sync="sortBy"
              :sort-desc.sync="sortDesc"
              prepend-inner-icon="mdi-magnify"
              placeholder="Search Amenities"
              label="Search Amenities"
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
              <v-tab> Amenities </v-tab>
              <v-tab> {{ amenityData.id ? "Edit" : "Add" }} Amenity </v-tab>
              <v-tab> Categories </v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab">
              <!-- Amenities DataTable -->
              <v-tab-item>
                <ApolloQuery
                  :query="require('@/graphql/config/amenities/amenities.gql')"
                  :variables="{ searchText }"
                >
                  <ApolloSubscribeToMore
                    :document="
                      require('@/graphql/config/amenities/amenityAdded.gql')
                    "
                    :update-query="onAmenityAdded"
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
                          data.amenities.map((item, i) => {
                            return { ...item, sno: i + 1 };
                          })
                        "
                        :mobile-breakpoint="0"
                        :items-per-page="5"
                        class="elevation-1"
                      >
                        <template v-slot:[`item.mdiIcon`]="{ item }">
                          <v-icon>mdi-{{ item.mdiIcon }}</v-icon>
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
                        </template>
                      </v-data-table>
                    </div>

                    <!-- No result -->
                    <div v-else class="no-result apollo">No result :(</div>
                  </template>
                </ApolloQuery>
              </v-tab-item>
              <!-- Amenities Form -->
              <v-tab-item>
                <ApolloMutation
                  :mutation="
                    require('@/graphql/config/amenities/addOrUpdateAmenities.gql')
                  "
                  :variables="{
                    amenityData: amenityData,
                  }"
                  class="form"
                  @done="savedAmenity"
                >
                  <template slot-scope="{ mutate }">
                    <form v-on:submit.prevent="formValid && mutate()">
                      <v-row class="mt-3 pb-4">
                        <v-col cols="12" sm="6">
                          <v-textarea
                            placeholder="description"
                            outlined
                            label="Description"
                            rows="4"
                            dense
                            hide-details
                            prepend-inner-icon="mdi-pencil"
                            v-model="amenityData.description"
                          >
                          </v-textarea>
                          <ApolloQuery
                            :query="
                              require('@/graphql/config/amenities/amenityCategories.gql')
                            "
                            :variables="{ searchText }"
                          >
                            <template
                              slot-scope="{ result: { loading, error, data } }"
                            >
                              <div v-if="data">
                                <v-select
                                  v-model="amenityData.categoryId"
                                  :loading="loading"
                                  outlined
                                  class="mt-2"
                                  dense
                                  :items="data.amenityCategories"
                                  item-text="title"
                                  item-value="id"
                                  label="Category"
                                ></v-select>
                              </div>
                              <div v-else-if="error">
                                <v-alert type="error">
                                  Couldn't get Amenity Categories</v-alert
                                >
                              </div>
                            </template>
                          </ApolloQuery>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-text-field
                            v-model="amenityData.title"
                            class="mb-2"
                            dense
                            prepend-inner-icon="mdi-pen"
                            outlined
                            hide-details
                            placeholder="e.g. Swimming"
                            label="Title"
                          >
                          </v-text-field>
                          <v-autocomplete
                            v-model="amenityData.faIcon"
                            class="mb-2"
                            dense
                            :items="faIcons"
                            prepend-inner-icon="mdi-font-awesome"
                            outlined
                            hide-details
                            autocomplete="off"
                            placeholder="FontAwesome Icon"
                            label="fa-icon"
                          >
                          </v-autocomplete>
                          <v-autocomplete
                            v-model="amenityData.mdiIcon"
                            class="mb-2"
                            dense
                            :items="mdiIcons"
                            prepend-inner-icon="mdi-information-outline"
                            outlined
                            hide-details
                            prefix="mdi -"
                            :append-outer-icon="`mdi-${amenityData.mdiIcon}`"
                            placeholder="icon"
                            label="icon"
                          >
                          </v-autocomplete>

                          <!-- <v-autocomplete
                            :filter="customFilter"
                            prepend-inner-icon="mdi-emoticon-excited"
                            outlined
                            :items="emojis"
                            item-value="char"
                            placeholder="Select an emoticon"
                            v-model="amenityData.emoticon"
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
                          </v-autocomplete> -->
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
                              {{ amenityData.id ? "Update" : "Save" }}</v-btn
                            >
                          </div>
                        </v-col>
                      </v-row>
                    </form>
                  </template>
                </ApolloMutation>
              </v-tab-item>
              <!-- Categories Form and List -->
              <v-tab-item>
                <ApolloMutation
                  :mutation="
                    require('@/graphql/config/amenities/addOrUpdateAmenityCategories.gql')
                  "
                  :variables="{
                    categoryData: categoryData,
                  }"
                  class="form"
                  @done="savedCategory"
                >
                  <template slot-scope="{ mutate }">
                    <form v-on:submit.prevent="categoryFormValid && mutate()">
                      <v-row class="mt-2">
                        <v-col cols="12" sm="4">
                          <v-text-field
                            dense
                            outlined
                            hide-details
                            label="title"
                            v-model="categoryData.title"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="5">
                          <v-text-field
                            outlined
                            hide-details
                            dense
                            label="description"
                            v-model="categoryData.description"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="3">
                          <v-btn type="submit" :disabled="!categoryFormValid"
                            ><v-icon left>{{
                              categoryData.id ? "mdi-pencil" : "mdi-plus"
                            }}</v-icon
                            >{{ categoryData.id ? "Update" : "Add" }}</v-btn
                          >
                        </v-col>
                      </v-row>
                    </form>
                  </template>
                </ApolloMutation>
                <ApolloQuery
                  :query="
                    require('@/graphql/config/amenities/amenityCategories.gql')
                  "
                  :variables="{ categorySearchText }"
                >
                  <ApolloSubscribeToMore
                    :document="
                      require('@/graphql/config/amenities/amenityCategoryAdded.gql')
                    "
                    :update-query="onAmenityCategoryAdded"
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
                        :headers="categoryHeaders"
                        dense
                        :items="
                          data.amenityCategories.map((item, i) => {
                            return { ...item, sno: i + 1 };
                          })
                        "
                        :mobile-breakpoint="0"
                        :items-per-page="4"
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
                                  @click="editCategoryItem(item)"
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
                                  @click="deleteCategoryItem(item)"
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
            </v-tabs-items>
          </v-card-text>
        </div>
      </v-expand-transition>
    </v-card>
  </div>
</template>

<script>
import mdiIcons from "../data/mdiIconNames.json";
import faIcons from "../data/faIcons.json";
import { mapActions } from "vuex";
import AMENITIES_QUERY from "@/graphql/config/amenities/amenities.gql";
import DELETE_QUERY from "@/graphql/config/amenities/deleteAmenity.gql";
import AMENITY_CATEGORIES_QUERY from "@/graphql/config/amenities/amenityCategories.gql";
import DELETE_CATEGORY_QUERY from "@/graphql/config/amenities/deleteAmenityCategory.gql";

export default {
  data() {
    return {
      show: true,
      searchText: "",
      categorySearchText: "",
      sortBy: "title",
      sortDesc: false,
      tab: 0,
      mdiIcons,
      faIcons,
      headers: [
        {
          text: "S/N",
          align: "start",
          sortable: true,
          value: "sno",
        },
        { text: "Title", value: "title" },
        { text: "Description", value: "description" },
        { text: "Icon", value: "mdiIcon" },
        { text: "Actions", value: "actions" },
      ],
      categoryHeaders: [
        {
          text: "ID",
          align: "start",
          sortable: true,
          value: "id",
        },
        { text: "Title", value: "title" },
        { text: "Description", value: "description" },
        { text: "Actions", value: "actions" },
      ],
      amenityData: {
        id: "",
        title: "",
        description: "",
        faIcon: "",
        mdiIcon: "",
        categoryId: "",
      },

      categoryData: {
        id: "",
        title: "",
        description: "",
      },
    };
  },
  computed: {
    formValid() {
      if (
        this.amenityData.title &&
        this.amenityData.description &&
        this.amenityData.mdiIcon &&
        this.amenityData.faIcon
      ) {
        return true;
      }
      return false;
    },
    categoryFormValid() {
      if (this.categoryData.title && this.categoryData.description) {
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
      this.amenityData.emoticon = "";
      console.log({ data, item });
    },
    savedAmenity() {
      console.log({ amenityData: this.amenityData });

      this.showToast({
        show: true,
        message: `Amenity ${this.amenityData.id ? "Updated" : "Added"}`,
        sclass: "success",
      }).then((timeout) => {
        setTimeout(() => {
          this.clearForm();
          this.showToast({ show: false });
        }, timeout);
      });
    },
    savedCategory() {
      console.log({ categoryData: this.categoryData });
      this.showToast({
        show: true,
        message: `Category ${this.categoryData.id ? "Updated" : "Added"}`,
        sclass: "success",
      }).then((timeout) => {
        this.clearCategoryForm();
        setTimeout(() => {
          this.showToast({ show: false });
        }, timeout);
      });
    },
    onAmenityAdded(previousResult, { subscriptionData }) {
      console.log({ previousResult, subscriptionData });
      const newId = subscriptionData.data.amenityAdded.id;
      if (previousResult.amenities.find((x) => x.id === newId)) {
        return {
          amenities: previousResult.amenities.map((obj) => {
            // return previousResult.amenities.find((o) => o.id === newId) || obj;
            return obj.id == newId ? subscriptionData.data.amenityAdded : obj;
          }),
        };
      }
      return {
        amenities: [
          ...previousResult.amenities,
          subscriptionData.data.amenityAdded,
        ],
      };
    },
    onAmenityCategoryAdded(previousResult, { subscriptionData }) {
      console.log({ previousResult, subscriptionData });
      const newId = subscriptionData.data.amenityCategoryAdded.id;
      if (previousResult.amenityCategories.find((x) => x.id === newId)) {
        return {
          amenityCategories: previousResult.amenityCategories.map((obj) => {
            // return previousResult.amenities.find((o) => o.id === newId) || obj;
            return obj.id == newId
              ? subscriptionData.data.amenityCategoryAdded
              : obj;
          }),
        };
      }
      return {
        amenityCategories: [
          ...previousResult.amenityCategories,
          subscriptionData.data.amenityCategoryAdded,
        ],
      };
    },
    clearForm() {
      this.amenityData = {
        id: "",
        title: "",
        description: "",
        faIcon: "",
        mdiIcon: "",
        categoryId: "",
      };
      this.tab = 0;
    },
    clearCategoryForm() {
      this.categoryData = {
        id: "",
        title: "",
        description: "",
      };
    },
    editItem(item) {
      console.log({ item });
      const { id, title, description, faIcon, mdiIcon, category } = item;
      this.amenityData = { id, title, description, faIcon, mdiIcon };
      this.amenityData.categoryId = category ? category.id : null;
      this.tab = 1;
    },
    editCategoryItem(item) {
      console.log({ item });
      const { id, title, description } = item;
      this.categoryData = { id, title, description };
    },
    deleteItem(item) {
      console.log({ item });
      this.$apollo.mutate({
        mutation: DELETE_QUERY,
        variables: {
          amenityID: Number(item.id),
        },
        update: (
          store,
          {
            data: {
              deleteAmenity: { id },
            },
          }
        ) => {
          console.log({ id });
          const data = store.readQuery({
            query: AMENITIES_QUERY,
            variables: {
              searchText: "",
            },
          });
          data.amenities = data.amenities.filter((x) => x.id != id);

          store.writeQuery({
            query: AMENITIES_QUERY,
            variables: {
              searchText: "",
            },
            data,
          });
          this.showToast({
            show: true,
            message: "Amenity Deleted",
            sclass: "info",
          }).then((timeout) => {
            setTimeout(() => {
              this.clearForm();
              this.showToast({ show: false });
            }, timeout);
          });
        },
      });
    },
    deleteCategoryItem(item) {
      console.log({ item });
      this.$apollo.mutate({
        mutation: DELETE_CATEGORY_QUERY,
        variables: {
          categoryId: Number(item.id),
        },
        update: (
          store,
          {
            data: {
              deleteAmenityCategory: { id },
            },
          }
        ) => {
          console.log({ id });
          const data = store.readQuery({
            query: AMENITY_CATEGORIES_QUERY,
            variables: {
              searchText: "",
            },
          });
          data.amenityCategories = data.amenityCategories.filter(
            (x) => x.id != id
          );

          store.writeQuery({
            query: AMENITY_CATEGORIES_QUERY,
            variables: {
              searchText: "",
            },
            data,
          });
          this.showToast({
            show: true,
            message: "Category Deleted",
            sclass: "info",
          }).then((timeout) => {
            setTimeout(() => {
              this.clearCategoryForm();
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