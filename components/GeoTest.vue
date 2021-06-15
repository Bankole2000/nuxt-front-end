<template>
  <div class="geo-test">
    <v-row>
      <v-col>
        <v-btn @click="getUserLocation" block large class="subtitle mb-2"
          ><v-icon left>mdi-map-marker-radius</v-icon> Use My Current
          Location</v-btn
        >
      </v-col>
    </v-row>

    <div id="map-wrap" style="height: 50vh">
      <client-only>
        <l-map
          @click="moveMarker"
          :zoom="8"
          :center="[listingData.latitude, listingData.longitude]"
        >
          <!-- url="http://{s}.tile.osm.org/{z}/{x}/{y}.png" -->
          <l-tile-layer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          ></l-tile-layer>
          <l-marker
            draggable
            @dragend="moved"
            :lat-lng="[listingData.latitude, listingData.longitude]"
          >
            <l-tooltip>My listing is here!</l-tooltip>
          </l-marker>
        </l-map>
      </client-only>
    </div>
    <ApolloMutation
      :mutation="require('@/graphql/listings/updateListingGeodata.gql')"
      :variables="{
        listingUUID: listingUUID,
        updateData: listingData,
      }"
      class="form"
      @done="next"
    >
      <template slot-scope="{ mutate }">
        <form v-on:submit.prevent="formIsValid && mutate()">
          <v-row class="mt-1">
            <v-col cols="12" sm="6">
              <v-text-field
                outlined
                dense
                readonly
                hide-details
                label="Latitude"
                v-model="listingData.latitude"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                outlined
                dense
                readonly
                hide-details
                label="Longitude"
                v-model="listingData.longitude"
              >
              </v-text-field>
            </v-col>
          </v-row>
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
  </div>
</template>

<script>
export default {
  props: ["listingUUID"],
  data() {
    return {
      listingData: {
        latitude: 0,
        longitude: 0,
      },
    };
  },
  computed: {
    formIsValid() {
      return true;
    },
  },
  methods: {
    getUserLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.listingData.latitude = position.coords.latitude;
            this.listingData.longitude = position.coords.longitude;
            console.log(position);
          },
          (error) => {
            console.log(error);
          }
        );
      } else {
      }
    },
    moved(e) {
      console.log(e);
      const { lat, lng } = e.target._latlng;
      this.listingData.latitude = lat;
      this.listingData.longitude = lng;
    },
    moveMarker(e) {
      console.log({ e });
      const {
        latlng: { lat, lng },
      } = e;
      this.listingData.latitude = lat;
      this.listingData.longitude = lng;
    },
    next(e) {
      this.$emit("next", { listingData: this.listingData });
    },
  },
  mounted() {
    this.getUserLocation();
  },
};
</script>

<style>
</style>