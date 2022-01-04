<template>
  <v-container>
    <v-row v-if="nftFunds != {}">
      <v-col cols="12" sm="6" md="8">
        <v-row no-gutters style="margin-top: 25px;" align="center" justify="center">
          <h1>{{ getNFTDetails.name }}</h1>
        </v-row>
        <v-divider id="divider"></v-divider>
        <v-row>
          <v-col v-for="index in getNFTListInFund.length" :key="index" cols="4">
            <NFTCard
              :nft="getNFTListInFund[index - 1]"
              :index="index - 1"
              :owner="getNFTDetails.ownerAddress"
              :connectedAccount="getConnectedAccount"
            />
          </v-col>
          <v-col cols="4" v-if="getConnectedAccount == getNFTDetails.ownerAddress">
            <BidOnAuction />
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="6" md="4">
        <FundDetails :owner="getNFTDetails.ownerAddress" :connectedAccount="getConnectedAccount" />
      </v-col>
    </v-row>
    <v-row v-else style="text-align:center;">
      Loading NFT's present in the fund. Please wait!
    </v-row>
  </v-container>
</template>

<style scoped>
#divider {
  padding-bottom: 20px;
}
</style>

<script>
import NFTCard from "./NFTCard.vue";
import AddNFTCard from "./AddNFTCard.vue";
import FundDetails from "./FundDetails.vue";
import BidOnAuction from "./BidOnAuction.vue";


export default {
  components: {
    FundDetails,
    NFTCard,
    AddNFTCard,
    BidOnAuction
  },
  computed: {
    getNFTDetails() {
      console.log(this.$store.state.nftFunds[this.$route.query.contractId]);
      if (this.$store.state.nftFunds == null) return { name: "", nftList: [], ownerAddress: "" };
      return this.$store.state.nftFunds[this.$route.query.contractId];
    },
    getNFTListInFund() {
      if (this.$store.state.nftListInFund == null || this.$store.state.nftListInFund == {}) return [];
      return this.$store.state.nftListInFund[this.$route.query.contractId];
    },
    getConnectedAccount() {
      return this.$store.state.account;
    },
    
  },
  mounted() {
    this.$store.dispatch("getNFTsInAddress", { address: this.$route.query.contractId });
  },
};
</script>
