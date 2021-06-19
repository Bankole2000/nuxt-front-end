<template>
  <div class="listing-basic-details" style="width: 100%">
    <v-container>
      <v-row>
        <v-col cols="12">
          <ApolloMutation
            :mutation="require('@/graphql/listings/addListing.gql')"
            :variables="{
              listingData: listingData,
            }"
            class="form"
            @done="next"
          >
            <template slot-scope="{ mutate }">
              <form v-on:submit.prevent="formIsValid && mutate()">
                <v-text-field
                  outlined
                  autofocus
                  label="Listing Title"
                  v-model="listingData.title"
                  placeholder="E.g. Jay's Place, Kiki's Room, or Spacious 1 Bedroom Apt in Abuja"
                  hint="Give your listing a Title"
                ></v-text-field>
                <v-text-field
                  outlined
                  label="Street Address"
                  v-model="listingData.streetAddress"
                  placeholder="Apt No, Street No, Street Name, LGA, and City"
                  hint="This information will not be public until bookings are confirmed"
                ></v-text-field>
                <ApolloQuery :query="require('@/graphql/data/currencies.gql')">
                  <template slot-scope="{ result: { loading, error, data } }">
                    <!-- Loading -->
                    <div v-if="loading" class="loading apollo">Loading...</div>

                    <!-- Error -->
                    <div v-else-if="error" class="error apollo">
                      An error occured
                    </div>

                    <!-- Result -->
                    <div v-else-if="data" class="result apollo">
                      <v-autocomplete
                        clearable
                        solo
                        v-model="listingData.baseCurrency"
                        label="Select a Currency"
                        :items="data.currencies"
                        item-value="code"
                        item-text="name"
                        placeholder="Select A Currency..."
                        hint="What base Currency do you want this listed in"
                      >
                        <template
                          v-slot:selection="{ attr, on, item, selected }"
                        >
                          <v-chip
                            v-bind="attr"
                            :input-value="selected"
                            color="blue-grey"
                            class="white--text"
                            v-on="on"
                          >
                            <span
                              v-text="item.nativeSymbol"
                              class="mr-2"
                            ></span>
                            <span v-text="item.name"></span>
                          </v-chip>
                        </template>
                        <template v-slot:item="{ item }">
                          <v-list-item-avatar
                            color="indigo"
                            class="headline font-weight-light white--text"
                          >
                            {{ item.nativeSymbol }}
                          </v-list-item-avatar>
                          <v-list-item-content>
                            <v-list-item-title
                              v-text="item.name"
                            ></v-list-item-title>
                            <v-list-item-subtitle
                              v-text="item.symbol"
                            ></v-list-item-subtitle>
                          </v-list-item-content>
                          <v-list-item-action>
                            <v-icon>mdi-currency-usd-circle-outline</v-icon>
                          </v-list-item-action>
                        </template>
                      </v-autocomplete>
                    </div>

                    <!-- No result -->
                    <div v-else class="no-result apollo">No result :(</div>
                  </template>
                </ApolloQuery>
                <v-btn
                  type="submit"
                  :disabled="!formIsValid"
                  block
                  color="primary"
                  x-large
                  ><span class="title">{{
                    formIsValid ? "Let's Go!" : "Ready?"
                  }}</span>
                  <v-icon right>mdi-arrow-right-circle</v-icon></v-btn
                >
              </form>
            </template>
          </ApolloMutation>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      listingData: {
        title: "",
        streetAddress: "",
        baseCurrency: "",
      },
    };
  },
  computed: {
    formIsValid() {
      if (
        this.listingData.title &&
        this.listingData.streetAddress &&
        this.listingData.baseCurrency
      ) {
        return true;
      }
      return false;
    },
  },
  methods: {
    next(e) {
      console.log({ e });
      const {
        data: {
          addListing: { id, uuid },
        },
      } = e;
      this.$emit("next", {
        listingData: { ...this.listingData, id, uuid },
      });
    },
  },
};
</script>

<style>
</style>