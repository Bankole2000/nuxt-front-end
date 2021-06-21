<template>
  <div class="listing-form">
    <v-window v-model="step">
      <v-window-item :value="0">
        <ListingBasicDetails @next="moveNext" />
      </v-window-item>
      <v-window-item :value="1">
        <PropertyType :listingUUID="listingData.uuid" @next="moveNext" />
      </v-window-item>
      <v-window-item :value="2">
        <Location :listingUUID="listingData.uuid" @next="moveNext" />
      </v-window-item>
      <v-window-item :value="3">
        <GuestsCap :listingUUID="listingData.uuid" @next="moveNext" />
      </v-window-item>
      <v-window-item :value="4">
        <Sleeping :listingUUID="listingData.uuid" @next="moveNext" />
      </v-window-item>
      <v-window-item :value="5"
        ><GeoTest :listingUUID="listingData.uuid" @next="moveNext" /> Amenities
      </v-window-item>
      <v-window-item :value="6">
        <Amenities :listingUUID="listingData.uuid" @next="moveNext" />
      </v-window-item>
      <v-window-item :value="7">
        <Spaces :listingUUID="listingData.uuid" @next="moveNext"
      /></v-window-item>
      <v-window-item :value="8">
        <v-slide-group
          v-model="activeImage"
          class="py-4 px-0"
          active-class="success"
          show-arrows
        >
          <v-slide-item
            v-for="(image, i) in listingData.images.length + 1"
            :key="i"
            class="px-0"
          >
            <!-- v-slot:default="{ active, toggle }" -->
            <ImageModal
              :listingUUID="listingData.uuid"
              @addImage="addImage"
              :key="i"
              class="mx-2"
            /> </v-slide-item
        ></v-slide-group>
        <v-row>
          <v-btn @click="step++" class="ma-4" x-large color="primary" block>
            <span class="title">{{
              listingData.images.length ? "Next" : "Skip"
            }}</span>
            <v-icon right>mdi-arrow-right-circle</v-icon></v-btn
          >
        </v-row>
      </v-window-item>
      <v-window-item :value="9">
        <Rules :listingUUID="listingData.uuid" @next="moveNext" />
      </v-window-item>
      <v-window-item :value="10">
        <AdditionalRules :listingUUID="listingData.uuid" @next="moveNext" />
        Special Features
      </v-window-item>
      <v-window-item :value="11"> Pricing </v-window-item>
      <v-window-item :value="12">
        Descriptions (guest preferences - ideal for Students, Professionals,
        Tourists, male/female Elderly, Parents w/ children)
      </v-window-item>
    </v-window>
  </div>
</template>

<script>
import GeoTest from "../GeoTest.vue";
import ImageTest from "../ImageTest.vue";
import ImageModal from "../Modals/ImageModal.vue";
import AdditionalRules from "./ListingDetails/AdditionalRules.vue";
import Amenities from "./ListingDetails/Amenities.vue";
import ListingBasicDetails from "./ListingDetails/BasicDetails.vue";
import GuestsCap from "./ListingDetails/GuestsCap.vue";
import Location from "./ListingDetails/Location.vue";
import PropertyType from "./ListingDetails/PropertyType.vue";
import Rules from "./ListingDetails/Rules.vue";
import Sleeping from "./ListingDetails/Sleeping.vue";
import Spaces from "./ListingDetails/Spaces.vue";
export default {
  components: {
    ListingBasicDetails,
    PropertyType,
    Location,
    GuestsCap,
    Sleeping,
    GeoTest,
    Amenities,
    Spaces,
    ImageTest,
    ImageModal,
    Rules,
    AdditionalRules,
  },
  data() {
    return {
      listingData: {
        id: "",
        uuid: "",
        images: [],
      },
      activeImage: 0,
      step: 0,
    };
  },
  computed: {},
  methods: {
    moveNext(e) {
      console.log({ e });
      this.listingData = { ...this.listingData, ...e.listingData };
      console.log(this.listingData);
      this.step++;
    },
    addImage(e) {
      console.log({ e });
      const { image } = e;
      this.listingData.images.push(image);
      this.activeImage += 1;
    },
  },
};
</script>

<style>
</style>