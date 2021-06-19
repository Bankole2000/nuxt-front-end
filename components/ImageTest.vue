<template>
  <croppa
    v-model="myCroppa"
    :width="350"
    :height="350"
    placeholder="Choose an image"
    :placeholder-font-size="0"
    :disabled="false"
    :prevent-white-space="false"
    :show-remove-button="true"
    @file-choose="handleCroppaFileChoose"
    @file-size-exceed="handleCroppaFileSizeExceed"
    @file-type-mismatch="handleCroppaFileTypeMismatch"
    @image-remove="handleImageRemove"
    @move="handleCroppaMove"
    @zoom="handleCroppaZoom"
  >
  </croppa>
</template>

<script>
export default {
  data() {
    return {
      myCroppa: "",
    };
  },
  methods: {
    handleCroppaFileChoose(e) {
      console.log({ e });
    },
    handleCroppaFileSizeExceed(e) {
      console.log({ e });
    },
    handleCroppaFileTypeMismatch(e) {
      console.log({ e });
    },
    handleImageRemove(e) {
      console.log({ e });
    },
    handleCroppaMove(e) {
      console.log({ e });
    },
    handleCroppaZoom(e) {
      console.log({ e });
    },
  },
};
</script>

<style>
</style>