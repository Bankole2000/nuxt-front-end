<template>
  <div class="listing-amenities">
    <v-container>
      <ApolloMutation
        :mutation="require('@/graphql/listings/updateListingGuestCap.gql')"
        :variables="{
          listingUUID: listingUUID,
          updateData: {
            amenities: listingData.amenities.map((x) => Number(x)),
          },
        }"
        class="form"
        @done="next"
      >
        <template slot-scope="{ mutate }">
          <form v-on:submit.prevent="formIsValid && mutate()">
            <v-row>
              <v-col cols="12">
                <ApolloQuery
                  :query="
                    require('@/graphql/config/amenities/amenityCategories.gql')
                  "
                >
                  <template slot-scope="{ result: { loading, error, data } }">
                    <!-- Loading -->
                    <div v-if="loading" class="loading apollo">Loading...</div>

                    <!-- Error -->
                    <div v-else-if="error" class="error apollo">
                      An error occured
                    </div>

                    <!-- Result -->
                    <div v-else-if="data" class="result apollo">
                      <v-expansion-panels accordion>
                        <v-expansion-panel
                          v-for="(item, i) in data.amenityCategories"
                          :key="i"
                        >
                          <v-expansion-panel-header
                            :class="i < item.length ? 'pb-0' : ''"
                          >
                            <template v-slot:default="{ open }">
                              <v-row no-gutters>
                                <v-col
                                  :cols="
                                    $vuetify.breakpoint.mdAndUp ? '4' : '12'
                                  "
                                  :class="open ? 'primary--text' : ''"
                                  >{{ item.title }}</v-col
                                >
                                <v-col
                                  cols="8"
                                  v-if="$vuetify.breakpoint.mdAndUp"
                                  class="text--secondary"
                                >
                                  <v-fade-transition leave-absolute>
                                    <span v-if="open" key="0">
                                      {{ item.description }}
                                    </span>
                                    <span v-else key="1">
                                      <span
                                        v-for="(name, k) in item.amenities
                                          .filter((amenity) =>
                                            listingData.amenities.includes(
                                              amenity.id
                                            )
                                          )
                                          .map((x) => x.title)"
                                        :key="k"
                                        >{{ k > 0 ? ", " : " "
                                        }}{{ name }}</span
                                      >
                                    </span>
                                  </v-fade-transition>
                                </v-col>
                              </v-row>
                            </template></v-expansion-panel-header
                          >
                          <v-expansion-panel-content>
                            <v-row style="border-top: 1px solid lightgrey">
                              <v-col
                                cols="12"
                                sm="6"
                                v-for="(amenity, j) in item.amenities"
                                :key="j"
                              >
                                <v-checkbox
                                  class="mt-0"
                                  v-model="listingData.amenities"
                                  :hint="amenity.description"
                                  persistent-hint
                                  :hide-details="$vuetify.breakpoint.smAndDown"
                                  :value="amenity.id"
                                >
                                  <template v-slot:label>
                                    <div
                                      style="display: flex; align-items: center"
                                    >
                                      <v-icon class="mr-2"
                                        >mdi-{{ amenity.mdiIcon }}</v-icon
                                      >
                                      {{ amenity.title }}
                                    </div>
                                  </template>
                                </v-checkbox>
                              </v-col>
                            </v-row>
                          </v-expansion-panel-content>
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </div>
                  </template>
                </ApolloQuery>
                <v-btn
                  :disabled="!formIsValid"
                  type="submit"
                  block
                  x-large
                  color="primary"
                  class="mt-4"
                  ><span class="title">Next</span>
                  <v-icon right>mdi-arrow-right-circle</v-icon></v-btn
                >
              </v-col>
            </v-row>
          </form>
        </template>
      </ApolloMutation>
    </v-container>
  </div>
</template>

<script>
export default {
  props: ["listingUUID"],
  data() {
    return {
      listingData: {
        amenities: [],
      },
    };
  },
  computed: {
    formIsValid() {
      return this.listingData.amenities.length ? true : false;
    },
  },
  methods: {
    next(e) {
      console.log({ e });

      this.$emit("next", { listingData: this.listingData });
    },
  },
};
</script>

<style>
</style>