
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
              Currently only the nft's from the following link are supported:  <a href='https://opensea.io/assets?search[chains][0]=ETHEREUM&search[paymentAssets][0]=ETH&search[sortAscending]=false&search[sortBy]=LISTING_DATE&search[toggles][0]=BUY_NOW' target="_blank">link</a>
              Please open the NFT from the link and copy its link to the below input bar. <br/>
              Ex: https://opensea.io/assets/0x2f14f1b6c350c41801b2b7ba9445670d7e2ffc70/6256
            </v-row>
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
      var fundAddress = this.$route.query.contractId
      await this.$store.dispatch("addNFTToFund", {openseaUrl: this.openseaUrl, fundAddress: fundAddress});
      this.dialog = false;
      this.$vToastify.success("NFT bought !");
    },
    isOpenseaURL() {
      return this.openseaUrl.startsWith(this.openseaStartUrl);
    },
  },
};
</script>
