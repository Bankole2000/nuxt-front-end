<template>
  <div class="listing-property-details">
    <ApolloMutation
      :mutation="require('@/graphql/listings/updateListingPropertyType.gql')"
      :variables="{
        updateData: listingData,
        listingUUID: listingUUID,
      }"
      class="form"
      @done="next"
    >
      <template slot-scope="{ mutate }">
        <form v-on:submit.prevent="formIsValid && mutate()">
          <input type="hidden" :value="listingUUID" />
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-select
                  outlined
                  v-model="listingData.listingPurpose"
                  :items="purposes"
                  item-text="text"
                  item-value="value"
                  label="Listing Purpose"
                  placeholder="What is the place designed for"
                  hint="What is the Place designed for"
                >
                  <template v-slot:selection="{ item }">
                    <p class="my-0">
                      <v-icon left class="mr-2">{{ item.icon }}</v-icon>
                      <span v-text="item.text"></span>
                    </p>
                  </template>
                  <template v-slot:item="{ item }">
                    <v-list-item-avatar class="headline font-weight-light">
                      <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title v-text="item.text"></v-list-item-title>
                      <v-list-item-subtitle
                        v-html="item.description"
                      ></v-list-item-subtitle>
                    </v-list-item-content>
                  </template>
                </v-select>
                <v-row>
                  <v-col>
                    <v-select
                      outlined
                      v-model="selectedListingKind"
                      :disabled="!listingData.listingPurpose"
                      :items="kinds[listingData.listingPurpose]"
                      item-text="text"
                      return-object
                      @change="selectListingKind"
                      label="Listing kind"
                      placeholder="What kind of place is it"
                      hint="What kind of place is it"
                      persistent-hint
                    >
                      <template v-slot:selection="{ item }">
                        <p class="my-0">
                          <v-icon left class="mr-2">{{ item.icon }}</v-icon>
                          <span v-text="item.text"></span>
                        </p>
                      </template>
                      <template v-slot:item="{ item }">
                        <v-list-item-avatar class="headline font-weight-light">
                          <v-icon>{{ item.icon }}</v-icon>
                        </v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title
                            v-text="item.text"
                          ></v-list-item-title>
                          <v-list-item-subtitle
                            v-html="item.description"
                          ></v-list-item-subtitle>
                        </v-list-item-content>
                      </template>
                    </v-select>
                  </v-col>
                  <v-expand-transition>
                    <v-col v-show="listingData.listingKindCode">
                      <v-select
                        outlined
                        v-model="listingData.listingSubgroup"
                        :disabled="!listingData.listingKindCode"
                        :items="subgroups[listingData.listingKindCode]"
                        item-text="text"
                        item-value="value"
                        label="Property type"
                        placeholder="What kind of place is it"
                        hint="A bit more Specific"
                        persistent-hint
                      >
                        <template v-slot:selection="{ item }">
                          <p class="my-0">
                            <v-icon left class="mr-2">{{ item.icon }}</v-icon>
                            <span v-text="item.text"></span>
                          </p>
                        </template>
                        <template v-slot:item="{ item }">
                          <v-list-item-avatar
                            class="headline font-weight-light"
                          >
                            <v-icon>{{ item.icon }}</v-icon>
                          </v-list-item-avatar>
                          <v-list-item-content>
                            <v-list-item-title
                              v-text="item.text"
                            ></v-list-item-title>
                            <v-list-item-subtitle
                              v-html="item.description"
                            ></v-list-item-subtitle>
                          </v-list-item-content>
                        </template>
                      </v-select>
                    </v-col>
                  </v-expand-transition>
                </v-row>

                <v-select
                  outlined
                  v-model="listingData.listingType"
                  :items="types"
                  item-text="text"
                  item-value="value"
                  label="Listing Type"
                  hint="What type of place will your guests have?"
                  persistent-hint
                >
                  <template v-slot:selection="{ item }">
                    <p class="my-0">
                      <v-icon left class="mr-2">{{ item.icon }}</v-icon>
                      <span v-text="item.text"></span>
                    </p>
                  </template>
                  <template v-slot:item="{ item }">
                    <v-list-item-avatar class="headline font-weight-light">
                      <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title v-text="item.text"></v-list-item-title>
                      <v-list-item-subtitle
                        v-html="item.description"
                      ></v-list-item-subtitle>
                    </v-list-item-content> </template
                ></v-select>
                <v-btn
                  type="submit"
                  :disabled="!formIsValid"
                  block
                  color="primary"
                  x-large
                  ><span class="title">Next</span>
                  <v-icon right>mdi-arrow-right-circle</v-icon></v-btn
                >
              </v-col>
            </v-row>
          </v-container>
        </form>
      </template>
    </ApolloMutation>
  </div>
</template>

<script>
import { types, purposes, kinds, subgroups } from "../../data/listingData";
export default {
  props: ["listingUUID"],
  data() {
    return {
      listingData: {
        listingPurpose: "",
        listingType: "",
        listingKind: "",
        listingKindCode: "",
        listingSubgroup: "",
      },
      selectedListingKind: null,
      types,
      purposes,
      kinds,
      subgroups,
    };
  },
  computed: {
    formIsValid() {
      if (
        this.listingData.listingPurpose &&
        this.listingData.listingType &&
        this.listingData.listingKind &&
        this.listingData.listingKindCode &&
        this.listingData.listingSubgroup
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
        data: { updateListing },
      } = e;
      this.$emit("next", { listingData: { ...updateListing } });
    },
    selectListingKind(e) {
      console.log({ e });
      if (e) {
        const { code, value } = e;
        this.listingData.listingKind = value;
        this.listingData.listingKindCode = code;
        return;
      }
      this.listingData.listingKind = e;
      this.listingData.listingKindCode = e;
    },
  },
};
</script>

<style>
</style>