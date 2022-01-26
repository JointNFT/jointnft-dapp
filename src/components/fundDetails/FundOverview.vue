<template>
  <v-container>
    <v-row v-if="getCollectionDetails != {}">
      <v-col cols="12" sm="6" md="8">
        <v-row no-gutters style="margin-top: 25px;" align="center" justify="center">
          <h1>{{ getCollectionDetails.name }}</h1>
        </v-row>
        <v-divider id="divider"></v-divider>
        <v-row>
          <v-col v-for="index in getNFTListInFund.length" :key="index" cols="4">
            <NFTCard
              :nft="getNFTListInFund[index - 1]"
              :index="index - 1"
              :owner="getCollectionDetails.ownerAddress"
              :connectedAccount="getConnectedAccount"
            />
          </v-col>
          <!-- <v-col cols="4" v-if="getConnectedAccount == getCollectionDetails.ownerAddress">
            <BidOnAuction />
          </v-col> -->
        </v-row>
      </v-col>

      <v-col cols="6" md="4">
        <FundDetails :owner="getCollectionDetails.ownerAddress" :connectedAccount="getConnectedAccount"/>
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
    getCollectionDetails() {
      var details = this.$store.state.collectionDetails;
      if (details == null || details == {}) {
        return {};
      } 
      return details;
    },
    getNFTListInFund() {
      if (this.$store.state.nftListInFund == null || this.$store.state.nftListInFund == {}) return [];
      return this.$store.state.nftListInFund[this.$route.query.contractId];
    },
    getConnectedAccount() {
      return this.$store.state.account;
    },
    getCollectionDetais() {
      return this.$store.state.collectionDetails;
    }
    
  },
  mounted() {
    this.$store.dispatch("getMaticBalance");
    this.$store.dispatch("getCollectionDetails", { collectionContractId: this.$route.query.contractId } );
    this.$store.dispatch("getNFTsInAddress", { address: this.$route.query.contractId });
  },
};
</script>
