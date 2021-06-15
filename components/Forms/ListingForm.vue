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
        Details (Amenities & Amenity categories)</v-window-item
      >
      <v-window-item :value="7">
        Details (Amenities & Amenity categories)</v-window-item
      >
      <v-window-item :value="8"> Basic Details </v-window-item>
      <v-window-item :value="9"> Basic Details </v-window-item>
    </v-window>
  </div>
</template>

<script>
import GeoTest from "../GeoTest.vue";
import ListingBasicDetails from "./ListingDetails/BasicDetails.vue";
import GuestsCap from "./ListingDetails/GuestsCap.vue";
import Location from "./ListingDetails/Location.vue";
import PropertyType from "./ListingDetails/PropertyType.vue";
import Sleeping from "./ListingDetails/Sleeping.vue";
export default {
  components: {
    ListingBasicDetails,
    PropertyType,
    Location,
    GuestsCap,
    Sleeping,
    GeoTest,
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