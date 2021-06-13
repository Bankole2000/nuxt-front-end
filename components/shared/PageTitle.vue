<template>
  <div
    class="page-title py-6"
    :style="{ backgroundColor: $vuetify.theme.dark ? '#1e1e1e' : '#f8f9fa' }"
  >
    <v-container>
      <div style="display: flex; align-items: center">
        <div style="width: 50%; display: flex; align-items: center">
          <div
            class="page-title-icon"
            :style="{
              backgroundColor: $vuetify.theme.dark ? '#272727' : 'white',
            }"
          >
            <v-icon class="title-icon" size="32">mdi-home</v-icon>
          </div>
          <div style="display: flex; flex-direction: column">
            <h1 class="display-1">Page Title</h1>
            <v-breadcrumbs class="pl-0 py-0" :items="items">
              <template v-slot:divider>
                <v-icon>mdi-chevron-right</v-icon>
              </template>
            </v-breadcrumbs>
          </div>
        </div>
        <div style="width: 50%"></div>
      </div>
    </v-container>
  </div>
</template>

<script>
export default {
  data: () => ({
    items: [
      {
        text: "Dashboard",
        disabled: false,
        href: "breadcrumbs_dashboard",
      },
      {
        text: "Link 1",
        disabled: false,
        href: "breadcrumbs_link_1",
      },
      {
        text: "Link 2",
        disabled: true,
        href: "breadcrumbs_link_2",
      },
    ],
  }),
};
</script>

<style>
.page-title-icon {
  height: 60px;
  width: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  margin-right: 30px;
  box-shadow: 0 0.46875rem 2.1875rem rgba(4, 9, 20, 0.03),
    0 0.9375rem 1.40625rem rgba(4, 9, 20, 0.03),
    0 0.25rem 0.53125rem rgba(4, 9, 20, 0.05),
    0 0.125rem 0.1875rem rgba(4, 9, 20, 0.03);
}

.title-icon {
  background: linear-gradient(to top right, rgb(0, 110, 255), rgb(0, 174, 255));
  color: rgba(0, 0, 0, 0) !important;
  background-clip: text;
}
</style>