
<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600">
      <template v-slot:activator="{ on, attrs }">
        <v-img v-bind="attrs" v-on="on" src="../assets/add-photo-icon-29.png" />
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">Add NFT Opensea URL</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col>
                <v-text-field
                  v-model="openseaUrl"
                  :rules="[isOpenseaURL]"
                  label="Add opensea link"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="addNFTToFund"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<style scoped>
.row {
  margin-bottom: 10px;
}
.value {
  text-align: right;
  margin-right: 25px;
}
.key {
  text-align: left;
  margin-left: 25px;
}
.top-row {
  margin-top: 10px;
}
.bottom-row {
  margin-top: 10px;
}
</style>

<script>
export default {
  data: () => ({
    dialog: false,
    openseaUrl: "",
    openseaStartUrl: "https://opensea.io/assets/",
  }),

  methods: {
    async addNFTToFund() {
      console.log('...')
      console.log(this.$route.query.address)
      var fundAddress = this.$route.query.address
      await this.$store.dispatch("addNFTToFund", {openseaUrl: this.openseaUrl, fundAddress: fundAddress});
      this.dialog = false;
    },
    isOpenseaURL() {
      return this.openseaUrl.startsWith(this.openseaStartUrl);
    },
  },
};
</script>
