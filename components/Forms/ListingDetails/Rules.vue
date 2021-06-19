<template>
  <div class="listing-rules">
    <v-container>
      <v-row>
        <v-col cols="12">
          <ApolloQuery
            :query="require('@/graphql/config/houseRules/houseRules.gql')"
          >
            <template slot-scope="{ result: { loading, error, data } }">
              <!-- Loading -->
              <div v-if="loading" class="loading apollo">Loading...</div>

              <!-- Error -->
              <div v-else-if="error" class="error apollo">An error occured</div>

              <!-- Result -->
              <div v-else-if="data" class="result apollo">
                <div
                  style="
                    display: flex;
                    align-items: flex-end;
                    width: 80%;
                    margin: 10px auto;
                  "
                  v-for="(rule, i) in data.houseRules"
                  :key="i"
                >
                  <span
                    :class="
                      listingData.houseRules
                        .map((r) => r.ruleId)
                        .includes(+rule.id)
                        ? 'primary--text'
                        : 'grey--text'
                    "
                    style="width: 20%"
                    >{{
                      listingData.houseRules
                        .map((r) => r.ruleId)
                        .includes(+rule.id)
                        ? "Active"
                        : "Not Active"
                    }}</span
                  ><v-switch
                    hide-details
                    style="align-self: center"
                    @change="toggleRule($event, rule)"
                  ></v-switch
                  ><span
                    >{{ rule.title }}
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon
                          class="grey--text text--lighten-2"
                          v-bind="attrs"
                          v-on="on"
                          >mdi-help-circle-outline</v-icon
                        >
                      </template>
                      <span>{{ rule.description }}?</span>
                    </v-tooltip> </span
                  ><v-spacer></v-spacer
                  ><v-checkbox
                    style="width: 20%"
                    hide-details
                    v-if="
                      listingData.houseRules
                        .map((r) => r.ruleId)
                        .includes(+rule.id)
                    "
                    v-model="
                      listingData.houseRules.filter(
                        (x) => x.ruleId == rule.id
                      )[0]['isAllowed']
                    "
                  >
                    <template v-slot:label>
                      <div>
                        {{
                          listingData.houseRules.filter(
                            (x) => x.ruleId == rule.id
                          )[0]["isAllowed"]
                            ? "Yes"
                            : "No"
                        }}
                        <v-icon
                          >mdi-{{
                            listingData.houseRules.filter(
                              (x) => x.ruleId == rule.id
                            )[0]["isAllowed"]
                              ? rule.mdiIconTrue
                              : rule.mdiIconFalse
                          }}</v-icon
                        >
                      </div>
                    </template></v-checkbox
                  >
                </div>
              </div>

              <!-- No result -->
              <div v-else class="no-result apollo">No result :(</div>
            </template>
          </ApolloQuery>
          <v-btn
            color="primary darken-1"
            class="px-4 mt-4"
            x-large
            block
            @click="saveHouseRules"
            ><v-icon>mdi-content-save</v-icon>
            {{ listingData.houseRules.length ? "Next" : "Skip" }}</v-btn
          >
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import HOUSERULES_QUERY from "@/graphql/listings/updateListingHouseRules.gql";
export default {
  props: ["listingUUID"],
  data() {
    return {
      listingData: {
        houseRules: [],
      },
    };
  },
  methods: {
    ...mapActions(["showToast"]),
    toggleRule(e, rule) {
      console.log({ e, rule });
      if (e) {
        const { id: ruleId } = rule;
        this.listingData.houseRules.push({
          isAllowed: false,
          ruleId: Number(ruleId),
        });
      }
      if (!e) {
        const { id: ruleId } = rule;
        this.listingData.houseRules = this.listingData.houseRules.filter(
          (x) => x.ruleId != ruleId
        );
      }
      console.log(this.listingData.houseRules);
    },
    saveHouseRules(e) {
      console.log({ e });
      console.log({ houseRules: this.listingData.houseRules });
      if (this.listingData.houseRules.length) {
        this.$apollo.mutate({
          mutation: HOUSERULES_QUERY,
          variables: {
            listingUUID: this.listingUUID,
            updateData: this.listingData,
          },
          update: (store, { data }) => {
            console.log({ store, data });

            this.$emit("next", { listingData: this.listingData });
            this.showToast({
              show: true,
              message: "House Rules Added",
              sclass: "info",
            }).then((timeout) => {
              setTimeout(() => {
                this.showToast({ show: false });
              }, timeout);
            });
          },
        });
      }
    },
  },
};
</script>

<style>
</style>