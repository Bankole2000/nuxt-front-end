<template>
  <div class="listings">
    <v-card class="mb-2" tile elevation="8">
      <v-card-title class="primary white--text">
        Listings
        <v-spacer></v-spacer>
        <v-expand-x-transition>
          <v-card v-show="show" class="transparent" :elevation="0">
            <v-text-field
              v-model="searchText"
              dense
              :sort-by.sync="sortBy"
              :sort-desc.sync="sortDesc"
              prepend-inner-icon="mdi-magnify"
              placeholder="Search Listings"
              label="Search Listings"
              solo
              hide-details
            ></v-text-field>
          </v-card>
        </v-expand-x-transition>
        <v-spacer></v-spacer>
        <CreateListingModal />
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
              <v-tab> Listings </v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab">
              <!-- Listings DataTable -->
              <v-tab-item>
                <ApolloQuery
                  :query="require('@/graphql/listings/listings.gql')"
                  :variables="{ searchText }"
                >
                  <ApolloSubscribeToMore
                    :document="require('@/graphql/listings/listingAdded.gql')"
                    :update-query="onListingAdded"
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
                          data.listings.map((item, i) => {
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
                                  @click="editItem(item)"
                                >
                                  <v-icon small> mdi-eye </v-icon>
                                </v-btn>
                              </template>
                              <span>View Listing Page</span>
                            </v-tooltip>
                            <v-tooltip top>
                              <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                  icon
                                  v-bind="attrs"
                                  v-on="on"
                                  @click="editItem(item)"
                                >
                                  <v-icon small> mdi-details </v-icon>
                                </v-btn>
                              </template>
                              <span>View Listing Details</span>
                            </v-tooltip>
                            <v-tooltip top>
                              <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                  icon
                                  v-bind="attrs"
                                  v-on="on"
                                  @click="editItem(item)"
                                >
                                  <v-icon small> mdi-calendar-alert </v-icon>
                                </v-btn>
                              </template>
                              <span>View Bookings</span>
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
              <!-- Listings Form -->

              <!-- <ApolloMutation
                  :mutation="
                    require('@/graphql/listings/addOrUpdateListings.gql')
                  "
                  :variables="{
                    listingData: listingData,
                  }"
                  class="form"
                  @done="savedListing"
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
                            v-model="listingData.description"
                          ></v-textarea>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-text-field
                            v-model="listingData.title"
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
                            v-model="listingData.emoticon"
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
                              {{ listingData.id ? "Update" : "Save" }}</v-btn
                            >
                          </div>
                        </v-col>
                      </v-row>
                    </form>
                  </template>
                </ApolloMutation> -->
            </v-tabs-items>
          </v-card-text>
        </div>
      </v-expand-transition>
    </v-card>
  </div>
</template>

<script>
import emojis from "../../data/emoji.json";
import { mapActions } from "vuex";
import HOBBIES_QUERY from "@/graphql/listings/listings.gql";
import DELETE_QUERY from "@/graphql/listings/deleteListing.gql";
import CreateListingModal from "~/components/Modals/CreateListingModal.vue";

export default {
  components: { CreateListingModal },
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
        { text: "ID", value: "id" },
        { text: "Title", value: "title" },
        { text: "UUID", sortable: false, value: "uuid" },
        { text: "Actions", value: "actions" },
      ],
      listingData: {
        id: "",
        title: "",
        shortDescription: "",
        longDescription: "",
        additionalRules: [],
        baseCurrency: "",
        basicPrice: 0,
        pricePerWeekend: 0,
        pricePerWeek: 0,
        pricePerMonth: 0,
        guestCapacity: 0,
        guestArrivalDaysNotice: 0,
        guestBookingMonthsInAdvance: 0,
        bookingStayDaysMin: 0,
        bookingStayDaysMax: 0,
        locationCountry: "",
        locationState: "",
        locationCity: "",
        streetAddress: "",
        listingPurpose: "",
        listingType: "",
        latitude: 0,
        longitude: 0,
        houseRules: [{ isAllowed: false, ruleId: 0 }],
        amenities: [],
        specialFeatures: [],
        guestPreferences: [],
      },
    };
  },
  computed: {
    formValid() {
      if (
        this.listingData.title &&
        this.listingData.description &&
        this.listingData.emoticon
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
      this.listingData.emoticon = "";
      console.log({ data, item });
    },
    savedListing() {
      console.log({ listingData: this.listingData });

      this.showToast({
        show: true,
        message: `Listing ${this.listingData.id ? "Updated" : "Added"}`,
        sclass: "success",
      }).then((timeout) => {
        this.clearForm();
        setTimeout(() => {
          this.showToast({ show: false });
        }, timeout);
      });
    },

    onListingAdded(previousResult, { subscriptionData }) {
      console.log({ previousResult, subscriptionData });
      const newId = subscriptionData.data.listingAdded.id;
      if (previousResult.listings.find((x) => x.id === newId)) {
        return {
          listings: previousResult.listings.map((obj) => {
            // return previousResult.listings.find((o) => o.id === newId) || obj;
            return obj.id == newId ? subscriptionData.data.listingAdded : obj;
          }),
        };
      }
      return {
        listings: [
          ...previousResult.listings,
          subscriptionData.data.listingAdded,
        ],
      };
    },
    clearForm() {
      this.listingData = {
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
      this.listingData = { id, title, description, emoticon };
      this.tab = 1;
    },
    deleteItem(item) {
      console.log({ item });
      this.$apollo.mutate({
        mutation: DELETE_QUERY,
        variables: {
          listingUUID: item.uuid,
        },
        update: (
          store,
          {
            data: {
              deleteListing: { id },
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
          data.listings = data.listings.filter((x) => x.id != id);

          store.writeQuery({
            query: HOBBIES_QUERY,
            variables: {
              searchText: "",
            },
            data,
          });
          this.showToast({
            show: true,
            message: "Listing Deleted",
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