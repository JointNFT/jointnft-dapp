<template>
  <v-row>
    <v-col cols="12" sm="6" md="8">
      <v-row no-gutters style="margin-top: 25px;">
        <h1>Fund #1</h1>
      </v-row>
      <v-divider id="divider"></v-divider>
      <v-row>
        <v-col
          v-for="index in getNFTDetails.nftList.length"
          :key="index"
          cols="4"
        >
          <NFTCard :nft="getNFTDetails.nftList[index-1]" :index="index-1" :owner="getNFTDetails.ownerAddress" :connectedAccount="getConnectedAccount"/>
        </v-col>
        <v-col cols="4" v-if="getConnectedAccount==getNFTDetails.ownerAddress">
          <AddNFTCard />
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="6" md="4">
      <FundDetails :owner="getNFTDetails.ownerAddress" :connectedAccount="getConnectedAccount"/>
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
      console.log(this.$store.state.nftFunds[this.$route.query.contractId]);
      return this.$store.state.nftFunds[this.$route.query.contractId];
    },
    getConnectedAccount(){
      return this.$store.state.account;
    }
  },
};
</script>
