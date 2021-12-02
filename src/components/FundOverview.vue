<template>
  <v-row>
    <v-col cols="12" sm="6" md="8">
      <v-row no-gutters style="margin-top: 25px;">
        <h1>Fund #1</h1>
      </v-row>
      <v-divider id="divider"></v-divider>
      <v-row>
        <v-col
          v-for="(nft, contractId) in getNFTDetails.nftList"
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
      <FundDetails/>
    </v-col>
  </v-row>
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

export default {
  components: {
    FundDetails,
    NFTCard,
    AddNFTCard,
  },
  computed: {
    getNFTDetails() {
      console.log(this.$store.state.nftFunds[this.$route.query.contractId])
      return this.$store.state.nftFunds[this.$route.query.contractId];
    },
  }
};
</script>