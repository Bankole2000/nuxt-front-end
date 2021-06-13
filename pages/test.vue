<template>
  <div class="text-page">
    <page-title />
    <v-container>
      <v-row>
        <v-col cols="12" sm="12">
          <ListingsDataTable />
        </v-col>
        <v-col cols="12" sm="12">
          <CityAddRequests />
        </v-col>
        <v-col cols="12" sm="12">
          <StateAddRequests />
        </v-col>
        <v-col cols="12" sm="6">
          <HouseRulesConfig />
        </v-col>
        <v-col cols="12" sm="6">
          <ListingAmenities />
        </v-col>
        <v-col cols="12" sm="12">
          <HobbiesConfig />
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-card>
        <v-card-title>
          Users
          <v-spacer></v-spacer>
          <v-btn icon @click="show = !show">
            <v-icon
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
            <v-card-text>
              <ApolloQuery :query="require('@/graphql/users.gql')">
                <template slot-scope="{ result: { loading, error, data } }">
                  <!-- Loading -->
                  <div v-if="loading" class="loading apollo">Loading...</div>

                  <!-- Error -->
                  <div v-else-if="error" class="error apollo">
                    An error occured
                  </div>

                  <!-- Result -->
                  <div v-else-if="data" class="result apollo">
                    <v-data-table :headers="headers" :items="data.users">
                      <template v-slot:[`item.profile`]="{ item }">
                        <span
                          :style="{
                            wordBreak: $vuetify.breakpoint.mdAndUp
                              ? 'break-word'
                              : 'normal',
                          }"
                        >
                          {{ item.profile }}
                        </span>
                      </template>
                    </v-data-table>
                    {{ data.users }}
                  </div>

                  <!-- No result -->
                  <div v-else class="no-result apollo">No result :(</div>
                </template>
              </ApolloQuery>
            </v-card-text>
            <v-card-actions>
              <v-btn>Something</v-btn>
            </v-card-actions>
          </div>
        </v-expand-transition>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import HobbiesConfig from "@/components/Config/HobbiesConfig.vue";
import ListingAmenities from "~/components/Config/Amenities.vue";
import HouseRulesConfig from "~/components/Config/HouseRulesConfig.vue";
import PageTitle from "~/components/shared/PageTitle.vue";
import ListingsDataTable from "~/components/Admin/Listings/ListingsDataTable.vue";
import StateAddRequests from "~/components/Config/StateAddRequests.vue";
import CityAddRequests from "~/components/Config/CityAddRequests.vue";
export default {
  components: {
    HobbiesConfig,
    ListingAmenities,
    HouseRulesConfig,
    PageTitle,
    ListingsDataTable,
    StateAddRequests,
    CityAddRequests,
  },
  data() {
    return {
      show: true,
      headers: [
        {
          text: "Avatar",
          align: "start",
          sortable: false,
          value: "profile",
        },
        {
          text: "Username",
          align: "start",
          sortable: false,
          value: "username",
        },
        { text: "Name", value: "profile" },
        { text: "Email", value: "email" },
        { text: "Email Verfied", value: "emailIsVerified" },
        { text: "Sex", value: "gender" },
        { text: "Status", value: "isOnline" },
      ],
    };
  },
  layout: "default",
};
</script>

<style>
</style>