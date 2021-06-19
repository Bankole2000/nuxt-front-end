<template>
  <div class="listing-stay-days">
    <v-container>
      <v-row>
        <v-col> </v-col>
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
        guestArrivalDaysNotice: 0,
        guestBookingMonthsInAdvance: 0,
        bookingStayDaysMin: 0,
        bookingStayDaysMax: 0,
      },
    };
  },
};
</script>

<style>
</style>