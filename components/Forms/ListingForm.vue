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
        Guest Details (Guest Capacity, No of Bedrooms, No of
        Beds)</v-window-item
      >
      <v-window-item :value="3">
        Basic Details (No of Bathrooms, )</v-window-item
      >
      <v-window-item :value="4">
        Basic Details (Location Data - Country, State, City, Zip Code, Use
        Current Location?)</v-window-item
      >
      <v-window-item :value="5"> Amenities Details (Amenities)</v-window-item>
      <v-window-item :value="6"> Basic Details </v-window-item>
      <v-window-item :value="7"> Basic Details </v-window-item>
      <v-window-item :value="8"> Basic Details </v-window-item>
      <v-window-item :value="9"> Basic Details </v-window-item>
    </v-window>
  </div>
</template>

<script>
import ListingBasicDetails from "./ListingDetails/BasicDetails.vue";
import Location from "./ListingDetails/Location.vue";
import PropertyType from "./ListingDetails/PropertyType.vue";
export default {
  components: {
    ListingBasicDetails,
    PropertyType,
    Location,
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