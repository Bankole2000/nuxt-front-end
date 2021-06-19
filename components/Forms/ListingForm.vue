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
        <ImageModal :listingUUID="listingData.uuid" /> <ImageTest /> Pictures
      </v-window-item>
      <v-window-item :value="9"> House Rules </v-window-item>
      <v-window-item :value="10"> Special Features </v-window-item>
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
import Amenities from "./ListingDetails/Amenities.vue";
import ListingBasicDetails from "./ListingDetails/BasicDetails.vue";
import GuestsCap from "./ListingDetails/GuestsCap.vue";
import Location from "./ListingDetails/Location.vue";
import PropertyType from "./ListingDetails/PropertyType.vue";
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
  },
  data() {
    return {
      listingData: {
        id: "",
        uuid: "",
      },
      step: 0,
    };
  },
  methods: {
    moveNext(e) {
      console.log({ e });
      this.listingData = { ...this.listingData, ...e.listingData };
      console.log(this.listingData);
      this.step++;
    },
  },
};
</script>

<style>
</style>