<template>
  <div class="image-select-modal">
    <v-dialog
      :fullscreen="$vuetify.breakpoint.smAndDown"
      :scrollable="$vuetify.breakpoint.smAndDown"
      persistent
      v-model="dialog"
      width="500"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-card
          class="rounded-lg"
          :width="$vuetify.breakpoint.smAndDown ? '185' : '355'"
          :height="$vuetify.breakpoint.smAndDown ? '130' : '250'"
          v-bind="attrs"
          :img="uploadedImage ? uploadedImage.image.fileURL : null"
          v-on="uploadedImage ? '' : on"
          :style="{
            border: uploadedImage ? 'none' : '4px dashed grey',
          }"
        >
          <div
            v-if="!uploadedImage"
            style="
              width: 100%;
              height: 100%;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
            "
          >
            <v-icon size="48">mdi-camera</v-icon>
            <p :class="$vuetify.breakpoint.smAndDown ? 'title' : 'display-1'">
              Select An Image
            </p>
          </div>
          <div
            v-if="uploadedImage"
            style="width: 100%; height: 100%; position: relative"
          >
            <div
              style="display: flex; position: absolute; top: 10px; right: 10px"
            >
              <v-btn fab small color="primary" @click.stop="editImage"
                ><v-icon>mdi-pencil</v-icon></v-btn
              >
              <v-btn
                fab
                small
                color="error"
                class="ml-2"
                @click.stop="deleteImage"
                ><v-icon>mdi-delete-forever</v-icon></v-btn
              >
            </div>
          </div>
        </v-card>
      </template>

      <v-card>
        <v-card-title class="headline" style="position: relative">
          Upload An image <v-spacer> </v-spacer
          ><v-btn color="error" icon @click="dialog = false"
            ><v-icon>mdi-close</v-icon></v-btn
          ><v-progress-linear
            :active="uploadingImage"
            :indeterminate="uploadingImage"
            absolute
            bottom
            color="primary"
          ></v-progress-linear>
        </v-card-title>
        <v-expand-transition>
          <v-card-text v-show="imageSelected" class="pa-0"
            ><v-alert
              type="info"
              class="mb-0"
              prominent
              icon="mdi-camera-iris"
              text
              >Pinch to zoom, drag to move, use buttons to
              rotate/delete</v-alert
            ></v-card-text
          >
        </v-expand-transition>
        <v-expand-transition>
          <v-card-text v-show="!imageSelected" class="pa-0"
            ><v-alert
              type="info"
              class="mb-0"
              prominent
              icon="mdi-phone-rotate-landscape"
              text
              >For best results, please take pictures in landscape mode</v-alert
            ></v-card-text
          >
        </v-expand-transition>

        <v-card-text
          class="pa-0 mb-2"
          style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          "
        >
          <croppa
            :width="355"
            :height="250"
            :placeholder-font-size="24"
            :prevent-white-space="true"
            placeholder="Click / Tap to Set an image"
            :disabled="false"
            :show-loading="true"
            :quality="2"
            v-model="croppa"
            :show-remove-button="false"
          >
          </croppa>
          <v-expand-transition>
            <v-text-field
              style="width: 90%"
              class="mb-2"
              v-show="imageSelected"
              v-model="imageTitle"
              dense
              outlined
              hide-details
              placeholder="Picture of the Front Yard"
              label="Image title"
            >
            </v-text-field>
          </v-expand-transition>
          <v-expand-transition>
            <v-textarea
              style="width: 90%"
              v-show="imageSelected"
              v-model="imageDescription"
              dense
              rows="2"
              outlined
              hide-details
              placeholder="Some info about this picture"
              label="Image description (optional)"
            >
            </v-textarea>
          </v-expand-transition>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn
            @click="croppa.rotate(-1)"
            large
            :disabled="!imageSelected"
            icon
            color="accent"
            :class="{
              'mx-4': $vuetify.breakpoint.mdAndUp,
              'mx-2': !$vuetify.breakpoint.mdAndUp,
            }"
          >
            <v-icon>mdi-rotate-left</v-icon>
          </v-btn>
          <v-btn
            @click="croppa.rotate()"
            large
            :disabled="!imageSelected"
            icon
            color="accent"
            :class="{
              'mx-4': $vuetify.breakpoint.mdAndUp,
              'mx-2': !$vuetify.breakpoint.mdAndUp,
            }"
          >
            <v-icon>mdi-rotate-right</v-icon>
          </v-btn>
          <v-btn
            @click="croppa.remove()"
            large
            :disabled="!imageSelected"
            icon
            color="accent"
            :class="{
              'mx-4': $vuetify.breakpoint.mdAndUp,
              'mx-2': !$vuetify.breakpoint.mdAndUp,
            }"
          >
            <v-icon>mdi-delete-forever</v-icon>
          </v-btn>
          <v-spacer></v-spacer>

          <v-btn
            color="primary darken-1"
            class="px-4"
            :loading="uploadingImage"
            :disabled="!imageSelected || !imageTitle"
            large
            @click="saveImage"
            ><v-icon>mdi-content-save</v-icon> Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import ADDLISTINGIMAGE_QUERY from "@/graphql/listings/addListingImage.gql";
import { mapActions } from "vuex";
export default {
  props: ["listingUUID"],
  data() {
    return {
      dialog: false,
      imageTitle: "",
      imageDescription: "",
      uploadedImage: null,
      uploadingImage: false,
      listingImage: null,
      croppa: {},
    };
  },
  computed: {
    imageSelected() {
      if (this.croppa.hasImage) {
        return this.croppa.hasImage() ? true : false;
      } else {
        return false;
      }
    },
  },
  methods: {
    ...mapActions(["showToast"]),
    async saveImage(e) {
      this.uploadingImage = true;
      console.log({ e });
      console.log(this.croppa.getChosenFile());
      const { name, type } = this.croppa.getChosenFile();
      const image = await this.croppa.promisedBlob(type, 0.8);
      image.name = name;
      console.log({ image });
      console.log(this.listingUUID);
      this.$apollo.mutate({
        mutation: ADDLISTINGIMAGE_QUERY,
        variables: {
          file: image,
          listingUUID: this.listingUUID,
          title: this.imageTitle,
          description: this.imageDescription,
        },
        update: (store, { data }) => {
          console.log({ store, data });
          this.dialog = false;
          this.uploadingImage = false;
          this.uploadedImage = data.addListingImage;
          this.$emit("addImage", { image: data.addListingImage });
          this.showToast({
            show: true,
            message: "Listing Image Uploaded",
            sclass: "info",
          }).then((timeout) => {
            setTimeout(() => {
              this.showToast({ show: false });
            }, timeout);
          });
        },
      });
    },
    editImage(e) {
      console.log({ e });
    },
    deleteImage(e) {
      console.log({ e });
    },
  },
};
</script>

<style>
</style>