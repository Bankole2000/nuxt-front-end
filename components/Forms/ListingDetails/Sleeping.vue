<template>
  <div class="sleeping-arrangements">
    <v-container>
      <v-row>
        <v-col cols="12">
          <ApolloMutation
            :mutation="
              require('@/graphql/listings/updateListingSleepingArrangements.gql')
            "
            :variables="{
              listingUUID: listingUUID,
              updateData: listingData,
            }"
            class="form"
            @done="next"
          >
            <template slot-scope="{ mutate }">
              <form v-on:submit.prevent="formIsValid && mutate()">
                <div
                  style="display: flex; justify-content: center; width: 100%"
                >
                  <v-checkbox
                    @change="resetBeds"
                    v-model="listingData.idealForSleeping"
                    :label="`This place is ideal for sleeping / overnight stay - (${
                      listingData.idealForSleeping ? 'Yes' : 'No'
                    })`"
                  ></v-checkbox>
                </div>
                <v-scroll-y-reverse-transition group>
                  <v-row
                    v-show="listingData.idealForSleeping"
                    v-for="(bed, i) in listingData.beds"
                    :key="i"
                  >
                    <v-col cols="12" sm="10" offset-sm="1" class="py-1">
                      <div
                        style="display: flex; width: 100%; align-items: center"
                      >
                        <h3 class="mb-0 headline" style="flex: 4">
                          {{ bed.type }}
                        </h3>
                        <v-text-field
                          class="headline font-weight-normal"
                          solo
                          v-model="bed.quantity"
                          label="Capacity"
                          type="number"
                          :min="1"
                          placeholder="1"
                          hide-details
                          append-icon="mdi-bed"
                          style="flex: 4"
                        >
                          <template v-slot:prepend>
                            <v-tooltip top>
                              <template v-slot:activator="{ on }">
                                <v-btn
                                  :disabled="bed.quantity < 1"
                                  icon
                                  color="deep-orange lighten-1"
                                  @click="bed.quantity--"
                                >
                                  <v-icon large v-on="on"
                                    >mdi-minus-thick</v-icon
                                  >
                                </v-btn>
                              </template>
                              <span>Subtract</span>
                            </v-tooltip>
                          </template>
                          <template v-slot:append-outer>
                            <v-tooltip top>
                              <template v-slot:activator="{ on }">
                                <v-btn
                                  :disabled="bed.quantity >= 99"
                                  icon
                                  color="primary"
                                  @click="bed.quantity++"
                                >
                                  <v-icon large v-on="on"
                                    >mdi-plus-thick</v-icon
                                  >
                                </v-btn>
                              </template>
                              <span>Add</span>
                            </v-tooltip>
                          </template>
                        </v-text-field>
                        <v-tooltip top>
                          <template v-slot:activator="{ on }">
                            <v-btn
                              large
                              @click="removeBed(bed.type, i)"
                              color="error"
                              v-on="on"
                              icon
                              class="ml-2 mt-2"
                              text
                            >
                              <v-icon>mdi-close</v-icon>
                            </v-btn>
                          </template>
                          <span>Remove Bed</span>
                        </v-tooltip>
                      </div>
                    </v-col>
                  </v-row>
                </v-scroll-y-reverse-transition>
                <v-expand-transition>
                  <v-row v-show="listingData.idealForSleeping">
                    <v-col cols="12" sm="8" offset-sm="2">
                      <v-select
                        :items="typesOfBeds"
                        style="font-size: 1.5rem"
                        class="py-4"
                        outlined
                        :menu-props="{ offsetY: true }"
                        ref="bedSelect"
                        @change="addBed"
                        placeholder="Add A Bed"
                        hide-details
                      >
                      </v-select>
                    </v-col>
                  </v-row>
                </v-expand-transition>

                <v-btn
                  type="submit"
                  :disabled="!formIsValid"
                  block
                  color="primary"
                  class="mt-4"
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
  props: ["listingUUID"],
  data() {
    return {
      listingData: {
        beds: [],
        idealForSleeping: true,
      },
      typesOfBeds: [
        "Sofa Bed",
        "Single",
        "Double",
        "Couch",
        "Floor Mattress",
        "Bunk Bed",
        "Water Bed",
        "King Size",
        "Queen Size",
      ],
    };
  },
  computed: {
    formIsValid() {
      if (this.listingData.idealForSleeping && this.listingData.beds.length) {
        return true;
      }
    },
  },
  methods: {
    addBed(e) {
      console.log({ e });
      console.log(this.$refs["bedSelect"]);
      this.listingData.beds.push({ type: e, quantity: 0 });
      this.typesOfBeds = this.typesOfBeds.filter((bed) => bed !== e);
      this.$refs["bedSelect"].reset();
    },
    removeBed(type, i) {
      this.listingData.beds.splice(i, 1);
      this.typesOfBeds.push(type);
    },
    resetBeds() {
      this.typesOfBeds = [
        "Sofa Bed",
        "Single",
        "Double",
        "Couch",
        "Floor Mattress",
        "Bunk Bed",
        "Water Bed",
        "King Size",
        "Queen Size",
      ];
      this.listingData.beds = [];
    },
    next(e) {
      console.log({ e });
      this.$emit("next", { listingData: this.listingData });
    },
  },
};
</script>

<style>
</style>