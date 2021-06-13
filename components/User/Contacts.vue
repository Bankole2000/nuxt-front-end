<template>
  <div class="contacts">
    <v-list subheader class="pb-0">
      <v-subheader>Recent chat</v-subheader>
      <v-list-item-group v-model="item">
        <v-list-item
          v-for="item in items"
          :key="item.title"
          class="pl-0"
          style="border-bottom: 1px solid lightgrey"
        >
          <v-badge
            bordered
            bottom
            color="green accent-4"
            dot
            offset-x="25"
            offset-y="20"
          >
            <v-list-item-avatar>
              <v-img :src="item.avatar"></v-img>
            </v-list-item-avatar>
          </v-badge>

          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
            <v-list-item-subtitle
              >I was just saying Hi really</v-list-item-subtitle
            >
          </v-list-item-content>

          <v-list-item-action class="ml-n1">
            <v-list-item-action-text>yesterday</v-list-item-action-text>
            <v-chip class="ma-0" color="primary" x-small> 22 </v-chip>
          </v-list-item-action>
        </v-list-item>
      </v-list-item-group>
    </v-list>

    <v-divider></v-divider>

    <v-list subheader>
      <v-subheader>Previous chats</v-subheader>

      <v-list-item v-for="item in items2" :key="item.title">
        <v-list-item-avatar>
          <v-img :src="item.avatar"></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title v-text="item.title"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
export default {
  data: () => ({
    item: 0,
    items: [
      {
        active: true,
        title: "Jason Oner",
        avatar: "https://cdn.vuetifyjs.com/images/lists/1.jpg",
      },
      {
        active: true,
        title: "Ranee Carlson",
        avatar: "https://cdn.vuetifyjs.com/images/lists/2.jpg",
      },
      {
        title: "Cindy Baker",
        avatar: "https://cdn.vuetifyjs.com/images/lists/3.jpg",
      },
      {
        title: "Ali Connors",
        avatar: "https://cdn.vuetifyjs.com/images/lists/4.jpg",
      },
    ],
    items2: [
      {
        title: "Travis Howard",
        avatar: "https://cdn.vuetifyjs.com/images/lists/5.jpg",
      },
    ],
  }),
};
</script>

<style>
</style>