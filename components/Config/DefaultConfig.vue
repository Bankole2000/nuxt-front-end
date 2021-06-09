<template>
  <div class="hobbies-config">
    <v-card>
      <v-card-title>
        Hobbies
        <v-spacer></v-spacer>
        <v-btn icon @click="show = !show">
          <v-icon
            :style="{
              transform: `${show ? 'rotate(180deg)' : 'rotate(0deg)'}`,
              transition: 'all 0.2s ease-out',
            }"
            >mdi-chevron-double-up</v-icon
          >
        </v-btn>
      </v-card-title>
      <v-expand-transition>
        <div v-show="show">
          <v-card-text>
            <v-tabs v-model="tab">
              <v-tab> Hobbies </v-tab>
              <v-tab> Add / Edit Hobby </v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab">
              <!-- Hobbies DataTable -->
              <v-tab-item> Data tables here </v-tab-item>
              <!-- Hobbies Form -->
              <v-tab-item>Form Here</v-tab-item>
            </v-tabs-items>
          </v-card-text>
        </div>
      </v-expand-transition>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: true,
      tab: 0,
    };
  },
};
</script>

<style>
</style>