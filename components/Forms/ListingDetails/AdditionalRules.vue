<template>
  <div class="lising-additional-rules" style="height: 80vh; overflow: auto">
    <v-container>
      <ApolloMutation
        :mutation="require('@/graphql/listings/updateListingHouseRules.gql')"
        :variables="{
          listingUUID: listingUUID,
          updateData: listingData,
        }"
        class="form"
        @done="next"
      >
        <template slot-scope="{ mutate }">
          <form v-on:submit.prevent="formIsValid && mutate()">
            <v-row>
              <v-col cols="12">
                <v-scroll-y-transition group leave-absolute hide-on-leave>
                  <v-sheet
                    v-for="(rule, i) in listingData.additionalRules"
                    :key="i"
                    class="rounded-lg px-4 py-2 my-2"
                    elevation="2"
                  >
                    <div
                      style="
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                      "
                    >
                      <span class="headline">{{ rule }}</span>
                      <v-btn icon @click="removeRule(i)" color="error"
                        ><v-icon>mdi-close</v-icon></v-btn
                      >
                    </div>
                  </v-sheet>
                </v-scroll-y-transition>
                <v-text-field
                  outlined
                  class="headline py-4"
                  label="Add Additional Rules"
                  placeholder="e.g. Curfew by 10 p.m."
                  append-icon="mdi-plus-thick"
                  v-model="additionalRule"
                  @click:append="addRule"
                  @keydown.enter.prevent="addRule"
                >
                </v-text-field>
                <v-row>
                  <v-col
                    cols="12"
                    class="my-0 py-1"
                    v-for="(gsk, i) in guestsShouldKnow"
                    :key="i"
                  >
                    <!-- :label="gsk.title" -->
                    <v-checkbox
                      class="my-0"
                      hide-details
                      @change="toggleGsk($event, gsk)"
                      ><template v-slot:label>
                        <span class="grey--text text--darken-4">{{
                          gsk.title
                        }}</span>
                      </template></v-checkbox
                    >
                    <v-expand-transition>
                      <div
                        v-show="
                          listingData.guestsShouldKnow
                            .map((x) => x.id)
                            .includes(gsk.id)
                        "
                      >
                        <p class="my-0">{{ gsk.info }}</p>
                        <v-text-field
                          outlined
                          dense
                          hide-details
                          :error="gsk.description ? false : true"
                          label="description"
                          v-model="gsk.description"
                        ></v-text-field>
                      </div>
                    </v-expand-transition>
                  </v-col>
                </v-row>
                <v-btn
                  color="primary darken-1"
                  class="px-4 mt-4"
                  x-large
                  block
                  type="submit"
                  :disabled="
                    listingData.guestsShouldKnow.length &&
                    listingData.guestsShouldKnow.filter(
                      (x) => x.description.trim().length == 0
                    ).length
                      ? true
                      : false
                  "
                  @click="saveAdditionalRules"
                >
                  {{
                    listingData.additionalRules.length ||
                    listingData.guestsShouldKnow.length
                      ? "Next"
                      : "Skip"
                  }}
                  <v-icon right>mdi-arrow-right-bold-circle</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </form>
        </template>
      </ApolloMutation>
    </v-container>
  </div>
</template>

<script>
import { guestsShouldKnow } from "@/components/data/listingData";
export default {
  props: ["listingUUID"],
  data() {
    return {
      listingData: {
        additionalRules: [],
        guestsShouldKnow: [],
      },
      additionalRule: "",
      guestsShouldKnow,
    };
  },
  computed: {
    formIsValid() {
      if (
        (this.listingData.guestsShouldKnow.length &&
          this.listingData.guestsShouldKnow.filter(
            (x) => x.description.trim().length != 0
          ).length) ||
        !this.listingData.guestsShouldKnow.length
      ) {
        return true;
      }
      return false;
    },
  },
  methods: {
    addRule() {
      if (this.additionalRule) {
        this.listingData.additionalRules.push(this.additionalRule);
        this.additionalRule = "";
      }
      console.log({ rules: this.listingData.additionalRules });
    },
    removeRule(i) {
      this.listingData.additionalRules.splice(i, 1);
    },
    saveAdditionalRules(e) {
      // console.log({ e });
      console.log({ data: this.listingData });
    },
    toggleGsk(e, item) {
      console.log({ e });
      if (e) {
        this.listingData.guestsShouldKnow.push(item);
        return;
      }
      if (!e) {
        const index = this.listingData.guestsShouldKnow
          .map((x) => x.id)
          .indexOf(item.id);
        console.log({ index, id: item.id });
        this.listingData.guestsShouldKnow.splice(index, 1);
      }
    },
    next(e) {
      this.$emit("next", { listingData: this.listingData });
    },
  },
};
</script>

<style>
</style>