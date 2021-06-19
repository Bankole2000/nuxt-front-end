<template>
  <div class="listing-pricing">
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
        basicPrice: 0,
        pricePerWeekend: 0,
        pricePerWeek: 0,
        pricePerMonth: 0,
      },
    };
  },
};
</script>

<style>
</style>