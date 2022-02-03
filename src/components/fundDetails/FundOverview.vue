<template>
  <v-container>
    <v-main v-if="getConnectedAccount">
     <v-row v-if="getCollectionDetails != {}">
      <v-col cols="12" sm="7" md="9">
        <v-row no-gutters style="margin-top: 25px;" align="center" justify="center">
          <h1>{{ getCollectionDetails.name }}</h1>
        </v-row>
        <v-divider id="divider"></v-divider>
           <v-row v-if="getNFTList = null" style="text-align:center;" align="center" justify="center">
             No NFTs present in the collection
           </v-row>
        <v-row>
          <v-col v-for="(nft) in getNFTList" :key="nft.name" cols="4">
         <!--   <NFTCard
              :nft="getNFTListInFund[index - 1]"
              :index="index - 1"
              :owner="getCollectionDetails.ownerAddress"
              :connectedAccount="getConnectedAccount"
            />-->
            <NFTCard :nft="nft"/>
          </v-col>
          <!-- <v-col cols="4" v-if="getConnectedAccount == getCollectionDetails.ownerAddress">
            <BidOnAuction />
          </v-col> -->
        </v-row>
      </v-col>

      <v-col cols="5" md="3">
        <FundDetails :owner="getCollectionDetails.ownerAddress" :connectedAccount="getConnectedAccount"/>
      </v-col>
     </v-row>
     <v-row v-else style="text-align:center;">
      Loading NFT's present in the fund. Please wait!
     </v-row>
    </v-main>
    <v-main v-else style="text-align:center;">
      Connect to metamask wallet to see NFTs. The button is in the top right of the page !
    </v-main>
 
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
    /*
    getNFTListInFund() {
      if (this.$store.state.nftListInFund == null || this.$store.state.nftListInFund == {}) return [];
      return this.$store.state.nftListInFund[this.$route.query.contractId];
    },*/
    getNFTList(){
      return this.$store.state.nftDetails;
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
    this.$store.dispatch("loadNFTs", {address: this.$route.query.contractId, collection_id: this.$route.query.collectionId});
  },
};
</script>
