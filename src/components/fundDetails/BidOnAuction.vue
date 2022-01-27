<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600">
      <template v-slot:activator="{ on, attrs }">
        <v-img v-bind="attrs" v-on="on" src="../../assets/add-photo-icon-29.png" />
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">Bid on Zora Auction</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col>
                <v-text-field v-model="auctionId" :rules="[numberRule]" label="Enter the auctionId" required></v-text-field>
                <v-text-field v-model="amount" :rules="[numberRule]" label="Enter bid amount ( In Wei ) " required></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="placeBid()"> Place Bid </v-btn>
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
  props: [],
  data: () => ({
    dialog: false,
    amount: 0,
    auctionId: 0,
    numberRule: (v) => {
      if (v != null && v != "" && !v.trim()) return true;
      if (!isNaN(parseFloat(v)) && v >= 0) return true;
      return "Number has to be more than 0";
    },
  }),

  methods: {
    // async sellNFT() {
    //   var fundAddress = this.$route.query.contractId;
    //   console.log(fundAddress)
    //   await this.$store.dispatch("sellNFTfromFund", {
    //     index: this.index,
    //     sellPrice: this.sellPrice,
    //     fundAddress: fundAddress,
    //   }).then(() => {
    //     this.dialog = false;
    //     this.$vToastify.success("NFT sold for "+this.sellPrice+" MATIC!");
    //   });

    // },
    async placeBid() {
      const fundAddress = this.$route.query.contractId;
      this.$store.dispatch("bidOnNFT", {
        auctionId: this.auctionId,
        amount: this.amount,
        fundAddress,
      }).then(() => {
          this.dialog = false;
          this.$vToastify.success("Bid placed on NFT for "+this.amount+" wei!");
      });
    },
  },
};
</script>
