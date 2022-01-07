<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600">
      <template v-slot:activator="{ on, attrs }">
        <v-fab-transition>
          <v-btn v-bind="attrs" v-on="on" color="pink" dark absolute bottom right fab><v-icon>mdi-minus</v-icon></v-btn>
        </v-fab-transition>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">Put NFT on auction ( will be hosted in Zora ) ? </span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col>
                <v-text-field
                  v-model="reservePrice"
                  :rules="[numberRule]"
                  label="Reserve Price for the auction ( In Wei )"
                  required
                ></v-text-field>
                <v-text-field v-model="duration" :rules="[numberRule]" label="Duration of the auction( In sec )" required> </v-text-field>
                <v-text-field
                  v-model="curatorFee"
                  :rules="[numberRule]"
                  label="What percentage of the fees would you like to take ? (0-99)"
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
          <v-btn color="blue darken-1" text @click="putNFTonAuction(token_id, token_address)"> Auction NFT </v-btn>
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
  props: ["index", "owner", "token_id", "token_address"],
  data: () => ({
    dialog: false,
    sellPrice: "",
    duration: 0,
    curatorFee: 0,
    reservePrice: 0,
    numberRule: (v) => {
      if (v != null && v != "" && !v.trim()) return true;
      if (!isNaN(parseFloat(v)) && v >= 0 ) return true;
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
    async putNFTonAuction(tokenId, tokenAddress) {
      const fundAddress = this.$route.query.contractId;
      this.$store.dispatch("putNFTFromFundToAuction", {
        tokenId: tokenId,
        tokenContract: tokenAddress,
        duration: this.duration,
        reservePrice: this.reservePrice,
        curator: fundAddress,
        curatorFeePercentages: this.curatorFee,
        fundAddress
      }).then(() => {
        this.dialog = false;
        this.$vToastify.success("NFT has been put on auction !");
      });
    },
  },
};
</script>
