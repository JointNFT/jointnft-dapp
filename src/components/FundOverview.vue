<template>
  <v-row>
    <v-col cols="12" sm="6" md="8">
      <v-row no-gutters>
        <h1>Fund #1</h1>
        <v-spacer></v-spacer>
        <v-btn
          href="https://github.com/vuetifyjs/vuetify/releases/latest"
          text
          color="#6733e2"
        >
          Create </v-btn
        ><v-btn
          href="https://github.com/vuetifyjs/vuetify/releases/latest"
          text
          color="#6733e2"
        >
          Create
        </v-btn>
      </v-row>
      <v-divider id="divider"></v-divider>
      <v-row>
        <v-col
          v-for="(nft, contractId) in getNFTDetails.nfts"
          :key="nft.contractId"
          cols="4"
        >
          <NFTCard :nft="nft" />
        </v-col>
        <v-col cols="4" v-if="$store.state.isCurator">
          <AddNFTCard />
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="6" md="4">
      <v-container>
        <v-row>
          <BidNFTs />
        </v-row>
        <v-row>
          Eth: {{ $store.state.ethBalance }} <br />
          tokenBalance {{ getNFTDetails.userTokenBalance }}
        </v-row>
        <v-row>
          <v-btn v-on:click="refreshBalances"> refresh balance </v-btn>
        </v-row>
        <v-row>
          <v-text-field
            v-model="ethAmount"
            :rules="[numberRule]"
          ></v-text-field>
          <v-btn v-on:click="buyFundTokens"> Buy Tokens </v-btn>
        </v-row>
      </v-container>
    </v-col>
  </v-row>
</template>

<style scoped>
#divider {
  padding-bottom: 20px;
}
</style>

<script>
import FundCard from "./FundCard.vue";
import NFTCard from "./NFTCard.vue";
import BidNFTs from "./BidNFTs.vue";
import AddNFTCard from "./AddNFTCard.vue";

export default {
  components: {
    BidNFTs,
    NFTCard,
    AddNFTCard,
  },
  computed: {
    getNFTDetails() {
      console.log("teste");
      return this.$store.state.nftFunds[this.$route.query.contractId];
    },
  },
  methods: {
    refreshBalances() {
      this.$store.dispatch("refreshBalance", this.$route.query.contractId);
    },
    buyFundTokens() {
      this.$store.dispatch("buyFundTokens", {
        ethAmount: this.ethAmount,
        contractId: this.$route.query.contractId,
      });
    },
  },
  data: () => ({
    numberRule: (v) => {
      if (!v.trim()) return true;
      if (!isNaN(parseFloat(v)) && v >= 0 && v <= 999) return true;
      return "Number has to be between 0 and 999";
    },
    ethAmount: 0,
  }),
};
</script>